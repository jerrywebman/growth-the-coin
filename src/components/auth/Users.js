import React, { useState, useContext, useEffect } from "react";
import firebase from "./firebase";
import { AuthContext } from "../context/Auth";
import { useHistory } from "react-router-dom";

export default function Users() {
  const { currentUser, setPending } = useContext(AuthContext);

  const [data, setData] = useState({});
  //PACKAGE FORM STATES
  const [packageName, setPackageName] = useState("");
  const [packageMinAmount, setPackageMinAmount] = useState("");
  const [packageMaxAmount, setPackageMaxAmount] = useState("");
  const [profit, setProfit] = useState("");
  const [duration, setDuration] = useState("");

  const [email, setEmail] = useState("");
  const [btcAddress, setBtcAddress] = useState("");
  const [clientBtcAddress, setClientBtcAddress] = useState("");
  const [clientEthAddress, setClientEthAddress] = useState("");
  const [allPackage, setAllPackage] = useState([]);
  const [balance, setBalance] = useState(0);
  const [moreInfo, setMoreInfo] = useState({});
  const [tcgWallet, setTcgWallet] = useState({});
  const [transaction, setTransaction] = useState({});

  const db = firebase.firestore();
  const history = useHistory();

  useEffect(() => {
    //getPackage
    const fetchData = async () => {
      let docRef = await db
        .collection("package")
        .onSnapshot((querySnapshot) => {
          setAllPackage(
            querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
          );
        });
    };

    //GET COMPANY WALLET
    const fetchTcgWallet = async () => {
      let docRef = await db
        .collection("companyWallet")
        .doc("wuMvwGLVSiTZTwT3zmOR")
        .onSnapshot((doc) => {
          if (doc.exists) {
            setTcgWallet(doc.data());
          } else {
            console.log("No such document!");
          }
        });
    };

    //FETCH TRANSACTION
    const fetchTrxn = async () => {
      let docRef = await db
        .collection("transaction")
        .doc(currentUser.email)
        .onSnapshot((doc) => {
          setTransaction(doc.data());
        });
    };

    const fetchMoreUserInfo = async () => {
      let docRef = await db
        .collection("related")
        .doc(currentUser.email)
        .onSnapshot((doc) => {
          if (doc.exists) {
            setMoreInfo(doc.data());
          } else {
            console.log("No such document!");
          }
        });
    };

    //GET USER DATA
    const fetchUser = async () => {
      let docref = await db
        .collection("users")
        .doc(currentUser.uid)
        .onSnapshot((doc) => {
          if (doc.exists) {
            setData(doc.data());
          } else {
            console.log("No such document!");
          }
        });
    };
    fetchUser();
    fetchTcgWallet();
    fetchTrxn();
    fetchData();
    fetchMoreUserInfo();
  }, []);

  return (
    <>
      <div>
        <div className="page-wrapper">
          <div className="page-wrapper-inner"></div>
          <div className="row mb-2">
            <div className="card-body mb-0"></div>
          </div>
          <div></div>

          <div className="row mt-4 mb-4"></div>
          <div className="page-content mt-3">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-4">
                  <div className="card">
                    <div className="card-body mb-0">
                      <div className="row">
                        <div className="col-12 align-self-center">
                          <div className="">
                            <h4 className="mt-0 header-title">
                              Account Information
                            </h4>
                            <hr></hr>
                            <h4 className="mt-0 header-title">
                              Email: {currentUser.email}
                            </h4>
                            <hr></hr>

                            <h4 className="mt-0 header-title">
                              Username : {data.username}
                            </h4>
                            <hr></hr>
                            <h4 className="mt-0 header-title">
                              Fullname : {data.name}
                            </h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="card">
                    <div className="card-body mb-0">
                      <div className="row">
                        <div className="col-8 align-self-center">
                          <div className="">
                            <h4 className="mt-0 header-title">
                              Account Balance
                            </h4>
                            <h2 className="mt-0 font-weight-bold">
                              $<span>{moreInfo.balance}</span>
                            </h2>
                          </div>
                        </div>
                        <div className="col-4 align-self-center">
                          <div className="icon-info text-right">
                            <i className="dripicons-wallet bg-soft-success"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-body overflow-hidden p-0">
                      <div className="d-flex mb-0 h-100 dash-info-box">
                        <div className="w-100">
                          <div className="apexchart-wrapper">
                            <div
                              id="apex_column1"
                              className="chart-gutters"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="card carousel-bg-img">
                    <div className="card-body dash-info-carousel mb-0">
                      <div
                        id="carouselExampleControls"
                        className="carousel slide"
                        data-ride="carousel"
                      >
                        <div className="carousel-inner">
                          <div className="carousel-item active">
                            <div className="row">
                              <div className="col-12 align-self-center">
                                <div className="text-center">
                                  <h4 className="mt-0 header-title text-left">
                                    Your Package
                                  </h4>
                                  <div className="icon-info my-3">
                                    <i className="dripicons-jewel bg-soft-pink"></i>
                                  </div>
                                  <h2 className="mt-0 font-weight-bold">
                                    $1280.00
                                  </h2>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="carousel-item">
                            <div className="row">
                              <div className="col-12 align-self-center">
                                <div className="text-center">
                                  <h4 className="mt-0 header-title text-left">
                                    Your Wallet Address
                                  </h4>
                                  <div className="icon-info my-3">
                                    <i className="dripicons-store bg-soft-warning"></i>
                                  </div>
                                  <hr></hr>
                                  <h6 className="mb-1 text-muted">
                                    Btc: {moreInfo.btcAddress}
                                  </h6>
                                  <hr></hr>
                                  <h6 className="mb-1 text-muted">
                                    Eth: {moreInfo.ethAddress}
                                  </h6>
                                  <hr></hr>
                                  <h6 className="mb-1 text-muted">
                                    Ltc: {moreInfo.ethAddress}
                                  </h6>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="carousel-item">
                            <div className="row">
                              <div className="col-12 align-self-center">
                                <div className="text-center">
                                  <h4 className="mt-0 header-title text-left">
                                    TCG Wallet Address
                                  </h4>
                                  <div className="icon-info my-3">
                                    <i className="dripicons-basket bg-soft-info"></i>
                                  </div>
                                  <hr></hr>
                                  <h6 className="mb-1 text-muted">
                                    BTC: {tcgWallet.btc}
                                  </h6>
                                  <hr></hr>
                                  <h6 className="mb-1 text-muted">
                                    PAYEER: {tcgWallet.payeer}
                                  </h6>
                                  <hr></hr>
                                  <h6 className="mb-1 text-muted">
                                    ETH: {tcgWallet.eth}
                                  </h6>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="carousel-item">
                            <div className="row">
                              <div className="col-12 align-self-center">
                                <div className="text-center">
                                  <h4 className="mt-0 header-title text-left">
                                    TCG Wallet Address
                                  </h4>
                                  <div className="icon-info my-3">
                                    <i className="dripicons-basket bg-soft-info"></i>
                                  </div>
                                  <hr></hr>
                                  <h6 className="mb-1 text-muted">
                                    Doge: {tcgWallet.doge}
                                  </h6>
                                  <hr></hr>
                                  <h6 className="mb-1 text-muted">
                                    Perfect Money: {tcgWallet.perfect}
                                  </h6>
                                  <hr></hr>
                                  <h6 className="mb-1 text-muted">
                                    Lth: {tcgWallet.ltc}
                                  </h6>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <a
                          className="carousel-control-prev"
                          href="#carouselExampleControls"
                          role="button"
                          data-slide="prev"
                        >
                          <span
                            className="carousel-control-prev-icon"
                            aria-hidden="true"
                          ></span>
                          <span className="sr-only">Previous</span>
                        </a>
                        <a
                          className="carousel-control-next"
                          href="#carouselExampleControls"
                          role="button"
                          data-slide="next"
                        >
                          <span
                            className="carousel-control-next-icon"
                            aria-hidden="true"
                          ></span>
                          <span className="sr-only">Next</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* LAST TRANSACTION */}
              <div>
                <h3>LAST TRANSACTION(S)</h3>
              </div>
              <div className="row mb-6">
                <div className="col-12">
                  <div className="card">
                    <div className="card-body new-user order-list">
                      <h4 className="header-title mt-0 mb-3">TRANSACTION(S)</h4>
                      <div className="table-responsive">
                        <table className="table table-hover mb-0">
                          <thead className="thead-light">
                            <tr>
                              <th className="border-top-0">S/N</th>
                              <th className="border-top-0">Date</th>
                              <th className="border-top-0">Amount ($)</th>
                              <th className="border-top-0">Category</th>
                              {/* <th className="border-top-0">Trxn ID</th> */}
                              <th className="border-top-0">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>1</td>
                              <td>{transaction.date}</td>
                              <td>{transaction.amount}</td>
                              <td>{transaction.category}</td>
                              {/* <td>{transaction.trxnId}</td> */}
                              <td>
                                <span className="badge badge-boxed  badge-soft-success">
                                  {transaction.status}
                                </span>
                              </td>
                              <td></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="container"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
