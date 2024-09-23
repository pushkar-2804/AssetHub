import axios from 'axios';
export async function getWalletList(email: string, password: string) {
  try {
    const accessToken = await getToken(email, password);
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
    throw error;
  }
}

export async function handlePayment(
  email: string,
  password: string,
  walletAddress: string,
  amount: number,
  cartId: number,
) {
  try {
    const accessToken = await getToken(email, password);

    const paymentBody = {
      outputs: [
        {
          address: walletAddress,
          amount,
          note: `Payment for purchasing cart - ${cartId}`,
        },
      ],
    };
    const txnDetails = await axios.post(
      'https://dev.neucron.io/v1/tx/spend',
      paymentBody,
      {
        headers: {
          Authorization: accessToken,
        },
      },
    );
    // console.log(txnDetails.data.data.txid);
    return txnDetails.data.data.txid;
  } catch (error) {
    throw error;
  }
}

async function getToken(email: string, password: string) {
  try {
    const response = await axios.post('https://dev.neucron.io/v1/auth/login', {
      email,
      password,
    });
    return response.data.data.access_token;
  } catch (error) {
    throw error;
  }
}
