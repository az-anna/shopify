import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { sendLink } from '../utils/AuthService';
import Loader from '../components/Loader';
import Modal from '../components/Modal';

function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [formEmail, setFormEmail] = useState('');
  const [buttonEnabled, setButtonEnabled] = useState();
  const [isWaiting, setIsWaiting] = useState(false)
  const [responseStatus, setResponseStatus] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState("")
  const [modalMsg, setModalMsg] = useState("")

  useEffect(() => {
    if (formEmail) {
      setButtonEnabled(true);
    } else {
      setButtonEnabled(false);
    }
  }, [formEmail]);

  const sendEmail = async () => {
    setIsWaiting(true)
    try {
      const res = await sendLink(formEmail);
      if (res.status === 200) {
        setResponseStatus("success")
        setModalTitle("パスワード再設定のリンクが送信されました")
        setModalMsg("メールを確認し、本文中にあるリンクよりパスワード再設定の手続きを行ってください。")
        setIsWaiting(false)
        setShowModal(true)
      }
    } catch (error) {
      setResponseStatus("failed")
      setModalTitle("送信が失敗しました")
      setModalMsg("メールアドレスをご確認いただくか、管理者にお問合せください")
      setIsWaiting(false)
      setShowModal(true)
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    sendEmail();
  }

  function onConfirm() {
    setShowModal(false)
    navigate("/login");
    window.location.reload(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-indigo-100">
      <form
        className="p-10 bg-white w-96 rounded-xl drop-shadow-xl space-y-5"
        onSubmit={submitHandler}
      >
        <p className="text-center text-sm">登録しているメールアドレスを入力してください</p>
        <InputField
          type="email"
          label="Email"
          value={formEmail}
          onChange={(e) => setFormEmail(e.target.value)}
        />
        <Button
          title="Reset Password"
          disabled={!buttonEnabled}
        />
      </form>
      {isWaiting ? (
        <Loader />
      ) : null
      }
      { showModal ? (
        <Modal
          open={showModal}
          title={modalTitle}
          msg={modalMsg}
          status={responseStatus}
          onConfirm={onConfirm}
        />
      ) : null }
    </div>

  )
}
export default ForgotPasswordPage;
