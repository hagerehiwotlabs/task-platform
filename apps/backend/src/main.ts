import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import helmet from 'helmet'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import { AppModule } from './app.module'
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });


async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  
  // Security
  app.use(helmet())
  app.use(cookieParser())
  
  // Compression
  app.use(compression())
  
  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
  
  // Global prefix
  app.setGlobalPrefix('api/v1')
  
  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )
  
  await app.listen(process.env.PORT || 3000)
  
  console.log(`🚀 Server running on http://localhost:${process.env.PORT || 3000}`)
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start server:', error)
  process.exit(1)
})
