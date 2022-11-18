import * as React from "react";
import styles from "./index.module.css";
import _cover from "../../assets/cover.svg";
import Button from "../../components/button";
import Image from "next/image";
import { useRouter } from "next/router";

import { InjectedConnector } from "@wagmi/core";
import { useAccount, useConnect, useNetwork, useSwitchNetwork } from "wagmi";
import { useIsMounted } from "../../hooks/useMounted";
import { chains } from "../../utils/wagmiConfig";

function Home() {
  const [which, setWhich] = React.useState(0);
  const { chain } = useNetwork();

  const { switchNetwork } = useSwitchNetwork();
  const isMounted = useIsMounted();
  const { isConnected } = useAccount();

  const router = useRouter();
  // @ts-ignore
  const skip = () => setWhich((x) => !x);
  const start = () => router.push("/find");

  const { connect } = useConnect({ connector: new InjectedConnector() });

  return (
    <div className={styles.wrapper}>
      <div className={styles.image}>
        <Image src={_cover} alt="" />
      </div>
      <div className={styles.skip} onClick={skip}>
        Skip
      </div>
      <div className={styles.outline}>
        SISYPHUS PROTOCOL
        <br />{'"Tracker 3"'}
      </div>
      <div className={styles.desc}>
        La lutte elle-même vers les sommets suffit à remplir un cur
        d&#39;homme. Il faut imaginer Sisyphe heureux.
      </div>

      {isMounted && isConnected && chain?.id == chains[0].id ? (
        <Button
          className={styles.connect}
          onClick={() => {
            start();
          }}
        >
          {"Let's start"}
        </Button>
      ) : chain?.id != chains[0].id && switchNetwork ? (
        <Button
          className={styles.connect}
          onClick={() => switchNetwork(chains[0].id)}
        >
          Switch To mumbai
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
