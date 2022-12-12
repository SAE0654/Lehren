import axios from "axios";

export async function getProductoById(id) {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_ENDPOINT}api/productos/` + id);
  return res.data;
}
