import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  public users: User[];
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    const user = this.repo.create(createUserDto);
    const dbUser = await this.repo.save(user);

    return plainToInstance(CreateUserDto, dbUser);
  }

  public async findAll(): Promise<CreateUserDto[]> {
    const users = await this.repo.find();
    return plainToInstance(CreateUserDto, users);
  }

  public async findOne(id: number): Promise<CreateUserDto> {
    const user = await this.repo.findOne({ where: { id } });
    return plainToInstance(CreateUserDto, user);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    file?: Express.Multer.File,
  ): Promise<User> {
    const user = await this.repo.findOne({ where: { id } });

    if (!user) {
      throw new Error('Usuário com ID ${id} não encontrado');
    }

    Object.assign(user, updateUserDto);

    if (file) {
      user.photo_path = `uploads/${file.filename}`;
    }

    return this.repo.save(user);
  }

  public async remove(id: number): Promise<CreateUserDto> {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new Error(`O usuário não foi encontrado.`);
    }
    await this.repo.remove(user);
    return plainToInstance(CreateUserDto, user);
  }

  public async uploadFile(id: number, photoPath: string): Promise<User> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new Error(`O usuário não foi encontrado.`);
    }
    user.photo_path = photoPath;
    return this.repo.save(user);
  }
}
