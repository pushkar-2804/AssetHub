import axios from 'axios';
// TODO: when user registers. create a email in neucron. store the access token
export async function getWalletList(email: string, password: string) {
  try {
    const response = await axios.post('https://dev.neucron.io/v1/auth/login', {
      email,
      password,
    });

    const accessToken = response.data.data.access_token;
    const walletResponse = await axios.get(
      'https://dev.neucron.io/v1/wallet/paymail/list',
      {
        headers: {
          Authorization: accessToken,
        },
      },
    );

    return walletResponse.data.data.details.Wallets;
  } catch (error) {
    console.log(error);
    throw new Error('Neucron had some internal server error');
  }
}
