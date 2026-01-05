import { API_URL } from "./Api"

class DocumentService {

  fetchAllDocuments = async () => {
    const res = await fetch(`${API_URL}/api/documents`)
    const json = await res.json()
    return json
  }

}

export default new DocumentService()