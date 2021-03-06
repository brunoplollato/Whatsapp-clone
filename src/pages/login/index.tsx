import Head from "next/head";
import { Button } from "@material-ui/core";
import { auth, provider } from "../../../firebase";

import { Container, LoginContainer, Logo } from "./styles";

export default function Login() {

  const signIn = () => {
    auth.signInWithPopup(provider).catch(alert)
  }

  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>

      <LoginContainer>
        <Logo src='https://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png' width={200} height={200} objectFit="cover" />
        <Button onClick={signIn} variant="outlined">Sign in with Google</Button>
      </LoginContainer>
    </Container>
  );
}
