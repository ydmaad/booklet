import dotenv from 'dotenv';
dotenv.config();

// 👇 디버깅용 (나중에 삭제)
// console.log('🔑 API Keys Check:');
// console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✅ 있음' : '❌ 없음');
// console.log('TTB_KEY:', process.env.TTB_KEY ? '✅ 있음' : '❌ 없음');
// console.log('---');

import express from 'express';
import cors from 'cors';
import axios from 'axios';
import type { Request, Response } from 'express';
import { OpenAI } from 'openai';
import { createClient } from '@supabase/supabase-js';
import chatRouter from './routes/chat.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: '서버 작동중!' });
});

// 👇 채팅 라우트 추가!
app.use('/api/chat', chatRouter);

// 베스트 셀러 리스트 API
app.get('/api/books/list', async (req: Request, res: Response) => {
  try {
    const {
      queryType = 'Bestseller',
      maxResults = 10,
      start = 1,
      searchTarget = 'Book',
    } = req.query;

    const response = await axios.get(
      'http://www.aladin.co.kr/ttb/api/ItemList.aspx',
      {
        params: {
          ttbkey: process.env.TTB_KEY,
          QueryType: queryType,
          MaxResults: maxResults,
          start,
          SearchTarget: searchTarget,
          output: 'js',
          Version: '20131101',
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.log('알라딘 베스트셀러 api 에러', error);
    res
      .status(500)
      .json({ error: '베스트셀러 책 리스트를 가져오는데 실패했습니다.' });
  }
});

// ISBN으로 책 정보 검색 API
app.get('/api/books/isbn/:isbn', async (req: Request, res: Response) => {
  try {
    const { isbn } = req.params;

    const response = await axios.get(
      'http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx',
      {
        params: {
          ttbkey: process.env.TTB_KEY,
          itemIdType: 'ISBN13',
          ItemId: isbn,
          output: 'js',
          Version: '20131101',
          OptResult: 'ebookList,usedList,reviewList',
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.log('알라딘 책 검색 API 에러', error);
    res.status(500).json({ error: '책 정보를 가져오는데 실패했습니다.' });
  }
});

// 읽은 책 기반 or 신규 유저용 ai 책 추천
app.post('/api/books/recommend', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    const { data: books, error } = await supabase
      .from('book_reviews')
      .select('title, author, stars, memo')
      .eq('user_id', userId);

    if (error) throw error;

    let prompt: string;
    let systemMessage: string;

    if (books && books.length > 0) {
      const bookList = books
        .map(
          (book) => `- ${book.title} (${book.author}) - 별점: ${book.stars}/5`
        )
        .join('\n');

      systemMessage =
        '당신은 책 추천 전문가입니다. 사용자의 독서 취향을 분석해서 적절한 책을 추천해주세요.';

      prompt = `사용자가 읽은 책 목록:
${bookList}

위 책들을 기반으로 사용자가 좋아할 만한 한국 도서 5권을 추천해주세요.

**중요**: 반드시 아래 형식만 사용하세요. 링크, URL, 설명 절대 금지!

형식:
1. 책제목 - 저자명
2. 책제목 - 저자명
3. 책제목 - 저자명
4. 책제목 - 저자명
5. 책제목 - 저자명`;
    } else {
      systemMessage =
        '당신은 책 추천 전문가입니다. 독서를 시작하는 사람들에게 폭넓게 읽힐 수 있는 양질의 책을 추천해주세요.';

      prompt = `독서를 처음 시작하는 신규 사용자를 위해 다양한 장르의 한국 도서 5권을 추천해주세요.
조건:
- 대중적으로 인정받은 책
- 읽기 쉬운 책
- 다양한 장르 포함 (소설, 에세이, 자기계발 등)

**중요**: 반드시 아래 형식만 사용하세요. 링크, URL, 설명 절대 금지!

형식:
1. 책제목 - 저자명
2. 책제목 - 저자명
3. 책제목 - 저자명
4. 책제목 - 저자명
5. 책제목 - 저자명`;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemMessage,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.6,
    });

    const aiResponse = completion.choices[0]?.message.content;

    const cleanResponse = aiResponse?.replace(/\[.*?\]\(.*?\)/g, '');

    const bookTitles =
      cleanResponse?.match(/\d+\.\s*(.+?)\s*-/g)?.map((line) =>
        line
          .replace(/\d+\.\s*/, '')
          .replace(/\s*-.*$/, '')
          .trim()
      ) || [];

    console.log('AI 응답:', cleanResponse);

    const bookDetails = await Promise.all(
      bookTitles.map(async (title) => {
        try {
          const response = await axios.get(
            'http://www.aladin.co.kr/ttb/api/ItemSearch.aspx',
            {
              params: {
                ttbkey: process.env.TTB_KEY,
                Query: title,
                QueryType: 'Title',
                MaxResults: 1,
                start: 1,
                SearchTarget: 'Book',
                output: 'js',
                Version: '20131101',
              },
            }
          );
          return response.data.item?.[0] || null;
        } catch (error) {
          console.log(`"${title}" 검색 실패:`, error);
          return null;
        }
      })
    );

    const recommendations = bookDetails.filter((book) => book !== null);

    res.json({
      message:
        books && books.length > 0
          ? 'AI 맞춤 추천 성공!'
          : '신규 회원을 위한 추천 도서입니다!',
      isNewUser: !books || books.length === 0,
      recommendations,
    });
  } catch (err) {
    console.error('ai 추천 에러', err);
    res.status(500).json({ error: '책 추천에 실패했습니다.' });
  }
});

app.listen(PORT, () => {
  console.log(`서버 실행: http://localhost:${PORT}`);
});
