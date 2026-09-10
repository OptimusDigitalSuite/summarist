"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { openLogin } from "@/redux/modalSlice";
import { selectIsSignedIn } from "@/redux/userSlice";

// The Login CTA appears twice on this page (here and under the reviews), and
// both do the same thing: signed in, go to the app; signed out, open the modal.
export function useLoginCta() {
  const dispatch = useDispatch();
  const router = useRouter();
  const signedIn = useSelector(selectIsSignedIn);

  return () => (signedIn ? router.push("/for-you") : dispatch(openLogin()));
}

export default function Landing() {
  const onLogin = useLoginCta();

  return (
    <section id="landing">
      <div className="container">
        <div className="row">
          <div className="landing__wrapper">
            <div className="landing__content">
              <div className="landing__content__title">
                Gain more knowledge <br className="remove--tablet" />
                in less time
              </div>
              <div className="landing__content__subtitle">
                Great summaries for busy people,
                <br className="remove--tablet" />
                individuals who barely have time to read,
                <br className="remove--tablet" />
                and even people who don&rsquo;t like to read.
              </div>
              <button className="btn home__cta--btn" onClick={onLogin}>
                Login
              </button>
            </div>
            <figure className="landing__image--mask">
              <Image src="/assets/landing.png" alt="landing" width={400} height={400} style={{ width: "100%", height: "auto" }} priority />
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
