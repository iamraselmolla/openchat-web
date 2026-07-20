import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('12345678', 10);

  const user = await prisma.user.upsert({
    where: { email: 'raselmolla6336@gmail.com' },
    update: {},
    create: {
      email: 'raselmolla6336@gmail.com',
      passwordHash,
      name: 'Rasel Molla',
      settings: {
        create: {
          theme: 'system',
          defaultModel: 'llama-3.1-8b-instant',
          temperature: 0.7,
          maxTokens: 2048,
        },
      },
    },
  });

  const chat = await prisma.chat.create({
    data: {
      userId: user.id,
      title: 'Welcome to AI Chat',
      pinned: true,
      messages: {
        create: [
          { role: 'user', content: 'What can you help me with?' },
          {
            role: 'assistant',
            content:
              'I can help you write, debug code, brainstorm ideas, and answer questions — just start typing below.',
          },
        ],
      },
    },
  });

  console.log({ user: user.email, chat: chat.title });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
