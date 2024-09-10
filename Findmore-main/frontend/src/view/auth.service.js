import axios from "axios";

class AuthService {
  mockLogin = (email, password, role) => {
    return new Promise((resolve, reject) => {
      // Simulate an API response delay
      setTimeout(() => {
        if (email === "test@gmail.com" && password === "123") {
          // Mocked successful response
          const mockResponse = {
            token: "token123",
            user: {
              id: 1,
              email: "test@gmail.com",
              name: "Mocked User",
              role,
            }
          };
          localStorage.setItem("user", JSON.stringify(mockResponse));
          resolve({ data: mockResponse });
        } else {
          // Mocked failed response
          reject(new Error('Utilizador Inválido'));
        }
      }, 1000); // Delay of 1 second
    });
  };
  
  async login(email, password, role) {
    try {
      const { data } = await axios.post("http://localhost:3001/autenticar/login", { email, password ,role});

      if (data.token) {
        localStorage.setItem("user", JSON.stringify({
            idUtilizador: data.user.idUtilizador,
            nomeU: data.user.nomeU,
            email: data.user.email,
            ativo: data.user.ativo,
            role,
            token: data.token,
        }));
      }
      return data;
    } catch (reason) {
      throw new Error(reason.response.data.message);
    }
  }

  logout() {
    localStorage.removeItem("user");
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new AuthService();
