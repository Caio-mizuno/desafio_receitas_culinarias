import { instanceToPlain } from 'class-transformer';
import { User } from './user.entity';

describe('User Entity Serialization', () => {
  it('não deve serializar o campo senha', () => {
    const user = new User({ id: 1, nome: 'Teste', login: 'teste', senha: 'hash' });
    const plain = instanceToPlain(user);
    expect(plain).not.toHaveProperty('senha');
    expect(plain).toMatchObject({ id: 1, nome: 'Teste', login: 'teste' });
  });
});
