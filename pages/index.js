import stylse from "@/styles/home.module.css";
import axios, { Axios } from "axios";
import { useEffect, useState } from "react";
import { FaArrowRight, FaSpinner } from "react-icons/fa";
import { toast, Toaster } from "sonner";
import { MdDarkMode } from "react-icons/md";
import { MdLightMode } from "react-icons/md";

export default function Home() {
  const [isCodeSend, setIsCodeSend] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", JSON.stringify(newMode));
  };

  const sendPhoneHandler = async (e) => {
    e.preventDefault();

    if (phone.length != 11 || !phone.startsWith("09")) {
      return toast.error("شماره معتبر نیست");
    }
    setIsLoading(true);
    const res = await axios.post("/api/sms/send", { phone });

    setIsLoading(false);
    if (res.status == 200) {
      setIsCodeSend(true);
      setTimer(30);
    }
  };

  const sendcodeHandler = async (e) => {
    e.preventDefault();

    // if(code.length != 5){
    //   return toast.error('کد معتبر نیست')
    // }
    try {
      const res = await axios.post("/api/sms/verify", { phone, code });

      if (res.status == 202) {
        return toast.success("کد تایید شد");
      }
    } catch (error) {
      if (error.response.status == 410) {
        return toast.error("کد منقضی شده است");
      }
      if (error.response.status == 401) {
        return toast.error("کد معتبر نیست");
      }
    }
  };

  const prevStepHandler = () => {
    setIsCodeSend(false);
    setPhone("");
  };

  const resendCodeHandler = async () => {
    setCode("");
    setIsLoading(true);

    const res = await axios.post("/api/sms/send", { phone });
    setIsLoading(false);

    if (res.status == 200) {
      toast.success("کد دوباره ارسال شد");
      setTimer(30);
    }
  };

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) {
      setDarkMode(JSON.parse(savedMode));
    }
  }, []);

  useEffect(() => {
  if ('OTPCredential' in window) {
    const ac = new AbortController();

    navigator.credentials.get({
      otp: { transport: ['sms'] },
      signal: ac.signal,
    }).then(otp => {
      setCode(otp.code); // مقدار کد رو مستقیم وارد state کن
    }).catch(err => {
      console.log('Web OTP API error:', err);
    });

    return () => ac.abort();
  }
}, [isCodeSend]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((timer) => timer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <>
      <Toaster dir="rtl" position="top-center" />
      <form className={`${stylse.form} ${darkMode ? stylse.dark : ""}`}>
        <button type="button" className={stylse.mode} onClick={toggleDarkMode}>
          {darkMode ? (
            <MdLightMode size={25} fill="#f8f8f4ff" />
          ) : (
            <MdDarkMode size={26} fill="#221313ff" />
          )}
        </button>
        {!isCodeSend && (
          <div>
            <h2>ورود به سایت</h2>
            <label className={stylse.label} htmlFor="">
              شماره موبایل خود را وارد کنید
            </label>
            <br />
            <input
              onChange={(e) => setPhone(e.target.value)}
              className={stylse.input}
              type="text"
              placeholder="شماره موبایل..."
            />
            <br />
            <button onClick={sendPhoneHandler} className={stylse.button}>
              {isLoading ? (
                <FaSpinner className={stylse.spiner} />
              ) : (
                "ارسال کد تایید"
              )}
            </button>
          </div>
        )}
        {isCodeSend && (
          <div>
            <div onClick={prevStepHandler} className={stylse.prevstep}>
              <FaArrowRight />
              <span>مرحله قبل</span>
            </div>
            <h2>تایید شماره موبایل</h2>
            <label htmlFor="">کد ارسال شده رو وارد کنید</label>
            <input
              id="otp-input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={stylse.input}
              type="text"
              placeholder="کد..."
            />
            {timer > 0 ? (
              <p className={stylse.tryagain}>
                ارسال مجدد کد بعد از {timer} ثانیه
              </p>
            ) : (
              <p onClick={resendCodeHandler} className={stylse.sendAgain}>
                {isLoading ? (
                  <FaSpinner className={stylse.spiner} />
                ) : (
                  "ارسال مجدد کد"
                )}
              </p>
            )}
            <button onClick={sendcodeHandler} className={stylse.button}>
              تایید کد
            </button>
          </div>
        )}
      </form>
    </>
  );
}
