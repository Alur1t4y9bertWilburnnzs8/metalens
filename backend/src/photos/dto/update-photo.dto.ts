import { PartialType } from '@nestjs/mapped-types';
import { CreatePhotoDto } from './create-photo.dto';

/**
 * 更新照片的 DTO
 */
export class UpdatePhotoDto extends PartialType(CreatePhotoDto) { }
