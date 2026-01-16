import { PartialType } from '@nestjs/mapped-types';
import { CreateAlbumDto } from './create-album.dto';

/**
 * 更新相册的 DTO
 */
export class UpdateAlbumDto extends PartialType(CreateAlbumDto) { }
