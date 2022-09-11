import * as React from "react";
import styles from "./index.module.css";
import _emoji from "../../assets/illustration.svg";
import Button from "../../components/button";
import Nav from "../../components/nav";
import Image from "next/image";
import { useRouter } from "next/router";

import { InjectedConnector } from "@wagmi/core";
import { useAccount, useConnect } from "wagmi";
import { useIsMounted } from "../../hooks/useMounted";

function Home() {
  const [which, setWhich] = React.useState(0);
  const isMounted = useIsMounted();
  const { address, isConnected } = useAccount();

  const router = useRouter();
  // @ts-ignore
  const skip = () => setWhich((x) => !x);
  const start = () => router.push("/find");

  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  return (
    <div className={styles.wrapper}>
      <div className={styles.image}>
        <Image src={_emoji} alt="" />
      </div>
      <div className={styles.skip} onClick={skip}>
        Skip
      </div>
      <div className={styles.outline}>Sisyphus Protocol -- Tracker 3</div>
      <div className={styles.desc}>
        La lutte elle-même vers les sommets suffit à remplir un cœur
        d`&#39;`homme. Il faut imaginer Sisyphe heureux.
      </div>

      {isMounted && isConnected ? (
        <Button
          className={styles.connect}
          onClick={() => {
            start();
          }}
        >
          {"Let's start"}
        </Button>
      ) : (
        <Button className={styles.connect} onClick={() => connect()}>
          Connect Wallet
        </Button>
      )}
    </div>
  );
}

export default Home;
