import { Roles } from '@/decorators/role.decorator';
import { Role } from '@/enums/role';
import { AuthGuard } from '@/guard/auth.guard';
import { RolesGuard } from '@/guard/roles.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';

@Controller('test')
export class TestController {
  // ==========================================
  // Get ADMIN Test
  // ==========================================
  @UseGuards(AuthGuard, RolesGuard)
  @Get('getAdmin')
  //@Roles(Role.ADMIN, Role.TEACHER)
  getTest() {
    return 'Get ADMIN test';
  }
}
