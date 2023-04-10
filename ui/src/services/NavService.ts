import { Subject } from 'rxjs'
import { LoginUser } from '../beans/LoginUser'


// Should send a Loginstate DTO/Object 
export const userState = new Subject<LoginUser>()


