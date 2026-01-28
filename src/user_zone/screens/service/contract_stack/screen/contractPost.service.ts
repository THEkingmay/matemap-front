import apiClient from "../../../../../../constant/axios";
export async function getContractPosts(lastPostCreateAt : string | undefined , token : string | null) {
  const cursor = lastPostCreateAt || ""; 
  const res = await apiClient.get(`/api/contract-posts` , {
    headers : {
      'Authorization' : `Bearer ${token}`  // แนบไป ไม่เอาโพสต์ตัวเอง
    } ,
    params : {
       lastIndexCreate: cursor
    }
  })
  return res.data;  
}

export async function getContractPostById(id: string) {
  const res = await apiClient.get(`/api/contract-posts/${id}`)

  return res.data
}