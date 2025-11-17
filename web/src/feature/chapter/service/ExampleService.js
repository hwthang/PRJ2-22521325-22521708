import apiClient from "../../../utils/api"

class ExampleService{
  hello = async () => {
    const res = await apiClient.get('/')
    const data = res.data
    return data
  }
    
  
}

export default new ExampleService()