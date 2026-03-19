const API_URL = 'http://172.20.10.3:3000';  // replace with your backend IP

export const getUserById = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/api/users/${id}`);
    if (!response.ok) throw new Error('User not found');
    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
