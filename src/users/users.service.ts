import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private readonly users: User[] = [{
    "id": 1,
    "name": "Alan"
  }, {
    "id": 2,
    "name": "Bella"
  }, {
    "id": 3,
    "name": "Cola"
  }];

  create(createUserDto: CreateUserDto) {
    const newID = Math.max(...this.users.map((user) => user.id)) + 1;
    this.users.push({
      ...{"id": newID}, ...createUserDto
    });
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: Number): User  {
    return this.users.find((user) => user.id == id);
  }

  remove(id: Number) {
    for (let i = 0 ; i < this.users.length; i += 1) {
      if (this.users[i].id === id) {
        this.users.splice(i, 1);
      }
    }
  }
}
