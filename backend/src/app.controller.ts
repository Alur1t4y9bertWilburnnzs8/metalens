import { Controller, Get } from '@nestjs/common';

/**
 * 根路径与健康检查控制器
 * 用于响应 Zeabur/K8s 的健康检查请求
 */
@Controller()
export class AppController {
    @Get()
    getRoot() {
        return { status: 'ok', service: 'metalens-api', timestamp: new Date().toISOString() };
    }

    @Get('health')
    getHealth() {
        return { status: 'healthy' };
    }
}
