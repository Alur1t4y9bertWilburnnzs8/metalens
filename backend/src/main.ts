import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Increase payload limit for base64 image uploads
    app.use(json({ limit: '10mb' }));
    app.use(urlencoded({ extended: true, limit: '10mb' }));

    // Global request logger for debugging
    app.use((req, res, next) => {
        console.log(`[Incoming Request] ${req.method} ${req.url}`);
        next();
    });

    app.enableCors(); // Metalens frontend needs to call this
    app.useGlobalPipes(new ValidationPipe());
    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0');
    console.log(`[Backend] Application is running on: http://0.0.0.0:${port}`);
}
bootstrap();
