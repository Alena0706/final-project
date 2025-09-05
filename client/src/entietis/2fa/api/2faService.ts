import axios from 'axios';
import { userRegister2faSchema } from '../model/schemas';
import type { userRegister2faSchemaT } from '../model/types';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class TwoFactorService {
  static async register2FA(
    userId: number | undefined,
    userEmail: string | undefined,
  ): Promise<userRegister2faSchemaT> {
    console.log(typeof userId);
    const response = await axios.post<{ secret: userRegister2faSchemaT }>('/api/auth/register2FA', {
      userId,
      userEmail,
    });
    return userRegister2faSchema.parse(response.data.secret);
  }


}

export default TwoFactorService;
