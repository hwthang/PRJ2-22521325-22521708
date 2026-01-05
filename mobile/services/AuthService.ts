import { API_URL } from "./Api"
import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthService {
  login = async (data: any) => {
    console.log(data)
    const res = await fetch(`${API_URL}/api/accounts/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ account: data.account, password: data.password })
      }
    )

    const json = await res.json()

    console.log(json)


    const canAccess = json?.data?.token?.type == "member" ? true : false

    const my_account = JSON.stringify(json?.data?.token)

    if (canAccess) await AsyncStorage.setItem("my_account", my_account)

    return {
      canAccess,
      message: json?.message
    }
  }

  getMyAccount = async () => {
    const myAccount = await AsyncStorage.getItem("my_account")
    if (myAccount)
      return JSON.parse(myAccount)

    return null
  }

}

export default new AuthService()