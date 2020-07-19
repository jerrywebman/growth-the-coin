import React, { useState, useContext, useEffect } from "react";
import firebase from "./firebase";
import { AuthContext } from "../context/Auth";
import { useHistory } from "react-router-dom";

export default function Admin() {
  const { currentUser, pending } = useContext(AuthContext);

  const [data, setData] = useState({});
  //PACKAGE FORM STATES
  const [packageName, setPackageName] = useState("");
  const [packageMinAmount, setPackageMinAmount] = useState("");
  const [packageMaxAmount, setPackageMaxAmount] = useState("");
  const [profit, setProfit] = useState("");
  const [duration, setDuration] = useState("");
  const [tcgWallet, setTcgWallet] = useState({});

  const [email, setEmail] = useState("");
  const [btcAddress, setBtcAddress] = useState("");
  const [clientBtcAddress, setClientBtcAddress] = useState("");
  const [clientEthAddress, setClientEthAddress] = useState("");
  const [allPackage, setAllPackage] = useState([]);
  const [balance, setBalance] = useState(0);
  const [moreInfo, setMoreInfo] = useState({});
  const [allUserInfo, setAllUserInfo] = useState([]);

  //USER TRANSACTION DATA
  const [transaction, setTransaction] = useState([]);
  const [trxnAmount, setTrxnAmount] = useState("");
  const [trxnCategory, setTrxnCategory] = useState("");
  const [trxnId, setTrxnId] = useState("");
  const [trxnStatus, setTrxnStatus] = useState("");
  const [trxnDate, setTrxnDate] = useState("");
  const [trxnEmail, setTrxnEmail] = useState("");

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

    //FETCH TRANSACTION
    const fetchTrxn = async () => {
      let docRef = await db
        .collection("transaction")
        .onSnapshot((querySnapshot) => {
          setTransaction(
            querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
          );
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

    //FETCH ALL USER INFORMATION

    const fetchAllUserInfo = async () => {
      const db = firebase.firestore();
      let docRef = await db
        .collection("related")
        .orderBy("balance")
        .limit(12)
        .get()
        .then(function (querySnapshot) {
          setAllUserInfo(
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
    // const newDate = new Date();
    // const jsonDate = JSON.stringify(newDate);
    // console.log(jsonDate);
    fetchAllUserInfo();
    fetchTrxn();
    fetchUser();
    fetchTcgWallet();
    fetchData();
    fetchMoreUserInfo();
  }, [currentUser, pending]);

  //FUND USER
  const onFund = () => {
    db.collection("related")
      .doc(email)
      .update({
        balance: balance,
      })
      .then(() => {
        alert("user data updated");
        // //adding to transaction file in an array of objects
        // db.collection("transaction")
        //   .doc(email)
        //   .update({
        //     trxn: firebase.firestore.FieldValue.arrayUnion({
        //       amount: balance,
        //       category: "Account Credit",
        //       date: new Date(),
        //       trxnId: "",
        //       status: "Completed",
        //     }),
        //   })
        //   .catch((err) => {
        //     alert(err);
        //   });
        //ADDING TO TRANSACTION DATA
        const newDate = new Date();
        const jsonDate = JSON.stringify(newDate);
        console.log(jsonDate);
        db.collection("transaction")
          .doc(email)
          .update({
            email: email,
            amount: balance,
            category: "Account Credit",
            date: jsonDate,
            trxnId: "",
            status: "Completed",
          })
          .catch((err) => {
            alert(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //ADD FUND TO USER
  const onAddFund = () => {
    //convert to number
    const fund = Number(balance);
    //increment
    const increase = firebase.firestore.FieldValue.increment(fund);
    db.collection("related")
      .doc(email)
      .update({
        balance: increase,
      })
      .then(() => {
        alert("user balance updated ");
        //ADDING TO TRANSACTION DATA
        const newDate = new Date();
        const jsonDate = JSON.stringify(newDate);
        console.log(jsonDate);
        db.collection("transaction")
          .doc(email)
          .update({
            email: email,
            amount: balance,
            category: "Account Credit",
            date: jsonDate,
            trxnId: "",
            status: "Completed",
          })
          .catch((err) => {
            alert(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //MINUS FUND TO USER
  const onMinusFund = () => {
    //convert to number
    const fund = Number(balance);
    //decrement
    const increase = firebase.firestore.FieldValue.increment(fund);
    db.collection("related")
      .doc(email)
      .update({
        balance: increase,
      })
      .then(() => {
        alert("user balance updated ");
        //ADDING TO TRANSACTION DATA
        const newDate = new Date();
        const jsonDate = JSON.stringify(newDate);
        console.log(jsonDate);
        db.collection("transaction")
          .doc(email)
          .update({
            email: email,
            amount: balance,
            category: "Account Debit",
            date: jsonDate,
            trxnId: "",
            status: "Completed",
          })
          .catch((err) => {
            alert(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //ADD TRANSACTION DATA
  const onCreateTrxn = () => {
    db.collection("transaction")
      .doc(trxnEmail)
      .update({
        email: trxnEmail,
        amount: trxnAmount,
        category: trxnCategory,
        date: trxnDate,
        trxnId: trxnId,
        status: trxnStatus,
      })
      .then(() => {
        alert("Transaction Data Added");
      })
      .catch((err) => {
        alert(err);
      });
  };

  // CREATE NEW PACKAGE
  const onCreatePackage = () => {
    const db = firebase.firestore();
    db.collection("package").add({
      packageName,
      packageMinAmount,
      packageMaxAmount,
      profit,
      duration,
    });
    setTimeout(function () {
      window.location.href = "/dashboard";
    }, 3000);
  };

  //CREATE ADMIN
  const onCreateAdmin = () => {
    const functions = firebase.functions();
    const addAdminRole = functions.httpsCallable("addAdminRole");
    addAdminRole({ email }).then((result) => {
      console.log(result);
    });
  };

  //UPDATE BTC ADDRESS
  const onUpdateBtcAddress = () => {
    db.collection("related")
      .doc(email)
      .update({
        btcAddress: clientBtcAddress,
      })
      .then(() => {
        // return db.collection("users").doc(currentUser.id).set({
        //   btcAddress,
        // });
        alert("user Address updated");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //UPDATE ETH ADDRESS
  const onUpdateEthAddress = () => {
    db.collection("related")
      .doc(email)
      .update({
        ethAddress: clientEthAddress,
      })
      .then(() => {
        alert("user Eth Address updated");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

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
                                    DOGE: {tcgWallet.doge}
                                  </h6>
                                  <hr></hr>
                                  <h6 className="mb-1 text-muted">
                                    PERFECT MONEY: {tcgWallet.perfect}
                                  </h6>
                                  <hr></hr>
                                  <h6 className="mb-1 text-muted">
                                    LTH: {tcgWallet.ltc}
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
              {/* PENDING ORDERS */}
              {/* <div>
                <h3>Pending Order(s)</h3>
              </div>
              <div className="row mb-6">
                <div className="col-12">
                  <div className="card">
                    <div className="card-body new-user order-list">
                      <h4 className="header-title mt-0 mb-3">ORDER(S)</h4>
                      <div className="table-responsive">
                        <table className="table table-hover mb-0">
                          <thead className="thead-light">
                            <tr>
                              <th className="border-top-0">Username</th>
                              <th className="border-top-0">Date</th>
                              <th className="border-top-0">Amount ($)</th>
                              <th className="border-top-0">Category</th>
                              <th className="border-top-0">Trxn ID</th>
                              <th className="border-top-0">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transaction.map((item) => (
                              <tr>
                                <td>{item.email}</td>
                                <td>{item.date}</td>
                                <td>{item.amount}</td>
                                <td>{item.category}</td>
                                <td>{item.trxnId}</td>
                                <td>
                                  <span className="badge badge-boxed  badge-soft-success">
                                    {item.status}
                                  </span>
                                </td>
                                <td></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
              {/* TRANSACTION DATA */}
              <div className="row">
                <div className="container">
                  <div>
                    <h3>Last User(s) Transaction</h3>
                  </div>
                  <div className="row mb-6">
                    <div className="col-12">
                      <div className="card">
                        <div className="card-body new-user order-list">
                          <h4 className="header-title mt-0 mb-3">
                            TRANSACTION(S)
                          </h4>
                          <div className="table-responsive">
                            <table className="table table-hover mb-0">
                              <thead className="thead-light">
                                <tr>
                                  <th className="border-top-0">Email</th>
                                  <th className="border-top-0">Date</th>
                                  <th className="border-top-0">Amount ($)</th>
                                  <th className="border-top-0">Category</th>
                                  {/* <th className="border-top-0">Trxn ID</th> */}
                                  <th className="border-top-0">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {transaction.map((item) => (
                                  <tr>
                                    <td>{item.email}</td>
                                    <td>{item.date}</td>
                                    <td>{item.amount}</td>
                                    <td>{item.category}</td>
                                    {/* <td>{item.trxnId}</td> */}
                                    <td>
                                      <span className="badge badge-boxed  badge-soft-success">
                                        {item.status}
                                      </span>
                                    </td>
                                    <td></td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ADMIN FUNCTIONS */}
                  <div>
                    <h3 className="mb-3">Admin Special Functions</h3>
                  </div>
                  <div className="row">
                    <div className="col-lg-4">
                      <div className="card overflow-hidden">
                        <div className="card-body bg-gradient1">
                          <div className="">
                            <div className="card-icon">
                              <i className="far fa-user"></i>
                            </div>
                            <h2 className="font-weight-bold text-white">
                              Manage User Account
                            </h2>
                          </div>
                        </div>
                        <div className="card-body dash-info-carousel">
                          <div className="row">
                            <div className="col-6 align-self-center text-center">
                              <button
                                className="btn btn-sm btn-success"
                                data-toggle="modal"
                                data-target="#wallet-balance"
                              >
                                Fund User Account
                              </button>
                            </div>
                            <div className="col-6 align-self-center text-center">
                              <button
                                className="btn btn-sm btn-warning"
                                data-toggle="modal"
                                data-target="#btc-wallet-address"
                              >
                                Edit Btc Address
                              </button>
                            </div>
                          </div>

                          <div className="card-body dash-info-carousel"></div>
                          <div className="row">
                            <div className="col-6 align-self-center text-center">
                              <button
                                className="btn btn-sm btn-success"
                                data-toggle="modal"
                                data-target="#add-balance"
                              >
                                Add Fund To User Account
                              </button>
                            </div>
                            <div className="col-6 align-self-center text-center">
                              <button
                                className="btn btn-sm btn-warning"
                                data-toggle="modal"
                                data-target="#minus-fund"
                              >
                                Minus Fund From User Account
                              </button>
                            </div>
                          </div>
                          <div className="card-body dash-info-carousel">
                            <div className="row">
                              <div className="col-6 align-self-center text-center">
                                <button
                                  className="btn btn-sm btn-info"
                                  data-toggle="modal"
                                  data-target="#eth-wallet-address"
                                >
                                  Edit Eth Address
                                </button>
                              </div>
                              <div className="col-6 align-self-center text-center">
                                <button
                                  className="btn btn-sm btn-success"
                                  className="btn btn-sm btn-info"
                                  data-toggle="modal"
                                  data-target="#transaction-data"
                                >
                                  Add Trxn Data
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-4">
                      <div className="card overflow-hidden">
                        <div className="card-body bg-gradient3">
                          <div className="">
                            <div className="card-icon">
                              <i className="far fa-smile"></i>
                            </div>
                            <h2 className="font-weight-bold text-white">
                              Manage Company Transaction
                            </h2>
                          </div>
                        </div>
                        <div className="card-body dash-info-carousel">
                          <div className="row m-3">
                            <div className="col-12 align-self-center text-center">
                              <button
                                className="btn btn-sm btn-warning"
                                data-toggle="modal"
                                data-target="#add-user-package"
                              >
                                Add User Pack
                              </button>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-12 align-self-center text-center mb-3">
                              <button
                                className="btn btn-sm btn-info"
                                data-toggle="modal"
                                data-target="#add-Investment-package"
                              >
                                Add Investment Pack
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="card overflow-hidden">
                        <div className="card-body bg-gradient2">
                          <div className="">
                            <div className="card-icon">
                              <i className="fas fa-coins"></i>
                            </div>
                            <h2 className="font-weight-bold text-white">
                              Users Restrictions
                            </h2>
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-6 align-self-center text-center">
                              <button className="btn btn-sm btn-danger">
                                Delete User
                              </button>
                            </div>

                            <div className="col-6 align-self-center text-center">
                              <button className="btn btn-sm btn-warning">
                                Ban User
                              </button>
                            </div>
                          </div>
                          {/* Add Admin */}
                          <div className="card-body">
                            <div className="row">
                              <div className="col-12 align-self-center text-center">
                                <button
                                  className="btn btn-sm btn-info"
                                  data-toggle="modal"
                                  data-target="#add-admin"
                                >
                                  Add Admin
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* //ALL USERS INFORMATION                 */}
                  <div>
                    <h3>Users List</h3>
                  </div>
                  <div className="row mb-6">
                    <div className="col-12">
                      <div className="card">
                        <div className="card-body new-user order-list">
                          <div className="table-responsive">
                            <table className="table table-hover mb-0">
                              <thead className="thead-light">
                                <tr>
                                  <th className="border-top-0">Email</th>
                                  <th className="border-top-0">Balance($)</th>
                                  <th className="border-top-0">Btc address</th>
                                  <th className="border-top-0">Eth address</th>
                                  <th className="border-top-0">Ltc address</th>
                                  <th className="border-top-0">Doge address</th>
                                  <th className="border-top-0">Payeer</th>
                                  <th className="border-top-0">Perfect</th>
                                  <th className="border-top-0">Delete</th>
                                </tr>
                              </thead>
                              <tbody>
                                {allUserInfo.map((item) => (
                                  <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.balance}</td>
                                    <td>{item.btcAddress}</td>
                                    <td>{item.ethAddress}</td>
                                    <td>{item.ltcAddress}</td>
                                    <td>{item.dogeAddress}</td>
                                    <td>{item.payeerAddress}</td>
                                    <td>{item.perfectAddress}</td>
                                    <td>
                                      <button
                                        className="btn btn-sm btn-danger"
                                        // onClick={() => {
                                        //   const db = firebase.firestore();
                                        //   const docRef = db
                                        //     .collection("package")
                                        //     .doc(item.id);
                                        //   const removeDoc = docRef
                                        //     .update({
                                        //       perfectAddress: firebase.firestore.FieldValue.delete(),
                                        //     })
                                        //     .then(() => {
                                        //       alert(
                                        //         "Document successfully deleted!"
                                        //       );
                                        //     })
                                        //     .catch((error) => {
                                        //       console.error(
                                        //         "Error removing document: ",
                                        //         error
                                        //       );
                                        //     });
                                        // }}
                                      >
                                        X
                                      </button>
                                    </td>
                                    <td></td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* PLAN */}
                <div className="container">
                  <div>
                    <h3>Packages</h3>
                  </div>
                  <div className="row">
                    {allPackage.map((item) => (
                      <div className="col-lg-4">
                        <div class="card" key={item.id}>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => {
                              const db = firebase.firestore();
                              db.collection("package")
                                .doc(item.id)
                                .delete()
                                .then(() => {
                                  alert("Document successfully deleted!");
                                })
                                .catch((error) => {
                                  console.error(
                                    "Error removing document: ",
                                    error
                                  );
                                });
                            }}
                          >
                            Delete
                          </button>
                          <div class="card-body">
                            <h4 class="card-title">
                              <span className="testimonial-item-link">
                                {item.packageName}
                              </span>
                            </h4>
                            <p class="card-text">
                              Minimum investment -{" "}
                              <span className="testimonial-item-link">
                                ${item.packageMinAmount}
                              </span>
                              <br></br>
                              Maximum investment -{" "}
                              <span className="testimonial-item-link">
                                ${item.packageMaxAmount}
                              </span>{" "}
                              <br></br>
                              Profit -{" "}
                              <span className="testimonial-item-link">
                                {item.profit}%
                              </span>{" "}
                              <br></br>
                              Duration -{" "}
                              <span className="testimonial-item-link">
                                {item.duration}
                              </span>{" "}
                              <br></br>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* <!-- MODAL WALLET BALANCE -->
                    <!-- Button trigger modal -->
                                                
                        <!-- Modal --> */}
                <div
                  className="modal fade"
                  id="wallet-balance"
                  tabIndex="-1"
                  role="dialog"
                  aria-labelledby="exampleModalCenterTitle"
                  aria-hidden="true"
                  data-backdrop="false"
                >
                  <div
                    className="modal-dialog modal-dialog-centered"
                    role="document"
                  >
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">
                          Fund User Wallet
                        </h5>
                        <button
                          type="button"
                          className="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <div className="col-12 mb-3">
                          <label for="">Email Address</label>
                          <input
                            type="Email"
                            className="form-control"
                            id=""
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                          <div className="valid-feedback">Looks good!</div>
                        </div>
                        <div className="col-12 mb-3">
                          <label for="validationCustom02">Amount in $</label>
                          <input
                            type="number"
                            className="form-control"
                            id="validationCustom02"
                            placeholder="Amount in Dollar"
                            value={balance}
                            onChange={(e) => setBalance(e.target.value)}
                            required
                          />
                          <div className="valid-feedback">Looks good!</div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-dismiss="modal"
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={onFund}
                        >
                          Fund
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <!-- ADD FUND MODAL WALLET BALANCE -->
                    <!-- Button trigger modal -->
                                                
                        <!-- Modal --> */}
                <div
                  className="modal fade"
                  id="add-balance"
                  tabIndex="-1"
                  role="dialog"
                  aria-labelledby="exampleModalCenterTitle"
                  aria-hidden="true"
                  data-backdrop="false"
                >
                  <div
                    className="modal-dialog modal-dialog-centered"
                    role="document"
                  >
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">
                          Add Fund User Wallet
                        </h5>
                        <button
                          type="button"
                          className="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <div className="col-12 mb-3">
                          <label for="">Email Address</label>
                          <input
                            type="Email"
                            className="form-control"
                            id=""
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-12 mb-3">
                          <label for="validationCustom02">
                            Amount to Add in $
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            id="validationCustom02"
                            placeholder="Amount in Dollar"
                            value={balance}
                            onChange={(e) => setBalance(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-dismiss="modal"
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={onAddFund}
                        >
                          Add Fund
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <!-- Minus FUND MODAL WALLET BALANCE -->
                    <!-- Button trigger modal -->
                                                
                        <!-- Modal --> */}
                <div
                  className="modal fade"
                  id="minus-fund"
                  tabIndex="-1"
                  role="dialog"
                  aria-labelledby="exampleModalCenterTitle"
                  aria-hidden="true"
                  data-backdrop="false"
                >
                  <div
                    className="modal-dialog modal-dialog-centered"
                    role="document"
                  >
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">
                          Minus Fund From User Wallet
                        </h5>
                        <button
                          type="button"
                          className="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <div className="col-12 mb-3">
                          <label for="">Email Address</label>
                          <input
                            type="Email"
                            className="form-control"
                            id=""
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-12 mb-3">
                          <label for="validationCustom02">
                            Amount to Minus in $
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            id="validationCustom02"
                            placeholder="Amount in Dollar"
                            value={balance}
                            onChange={(e) => setBalance(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-dismiss="modal"
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={onMinusFund}
                        >
                          Minus Fund
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <!-- EDIT BTC WALLET ADDRESS -->
                    <!-- Button trigger modal -->
                                                
                        <!-- Modal --> */}
                <form onSubmit={handleSubmit}>
                  <div
                    className="modal fade"
                    id="btc-wallet-address"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalCenterTitle"
                    aria-hidden="true"
                    data-backdrop="false"
                  >
                    <div
                      className="modal-dialog modal-dialog-centered"
                      role="document"
                    >
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5
                            className="modal-title"
                            id="exampleModalLongTitle"
                          >
                            Edit client BTC Wallet
                          </h5>
                          <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <div className="col-12 mb-3">
                            <label for="clientemail">Email Address</label>
                            <input
                              type="email"
                              className="form-control"
                              id="clientemail"
                              placeholder="Email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              requireed
                            />
                          </div>
                          <div className="col-12 mb-3">
                            <label for="validationCustom02">
                              New Address BTC
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="validationCustom02"
                              placeholder="BTC Address"
                              value={clientBtcAddress}
                              onChange={(e) =>
                                setClientBtcAddress(e.target.value)
                              }
                              required
                            />
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            data-dismiss="modal"
                          >
                            Close
                          </button>
                          <button
                            type="button"
                            className="btn btn-success"
                            onClick={onUpdateBtcAddress}
                          >
                            Add Address
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
                {/* <!-- EDIT ETH WALLET ADDRESS -->
                    <!-- Button trigger modal -->
                                                
                        <!-- Modal --> */}
                <form onSubmit={handleSubmit}>
                  <div
                    className="modal fade"
                    id="eth-wallet-address"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalCenterTitle"
                    aria-hidden="true"
                    data-backdrop="false"
                  >
                    <div
                      className="modal-dialog modal-dialog-centered"
                      role="document"
                    >
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5
                            className="modal-title"
                            id="exampleModalLongTitle"
                          >
                            Edit client ETH Wallet
                          </h5>
                          <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <div className="col-12 mb-3">
                            <label for="clientemail">Email Address</label>
                            <input
                              type="email"
                              className="form-control"
                              id="clientemail"
                              placeholder="Email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              requireed
                            />
                          </div>
                          <div className="col-12 mb-3">
                            <label for="validationCustom02">
                              New Address ETH
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="validationCustom02"
                              placeholder="ETH Address"
                              value={clientEthAddress}
                              onChange={(e) =>
                                setClientEthAddress(e.target.value)
                              }
                              required
                            />
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            data-dismiss="modal"
                          >
                            Close
                          </button>
                          <button
                            type="button"
                            className="btn btn-success"
                            onClick={onUpdateEthAddress}
                          >
                            Add Address
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
                {/* ADD USER PACKAGE
                    < Button trigger modal                                                 
                    Modal  */}
                <form onSubmit={handleSubmit}>
                  <div
                    className="modal fade"
                    id="add-user-package"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalCenterTitle"
                    aria-hidden="true"
                    data-backdrop="false"
                  >
                    <div
                      className="modal-dialog modal-dialog-centered"
                      role="document"
                    >
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5
                            className="modal-title"
                            id="exampleModalLongTitle"
                          >
                            Add New Package
                          </h5>
                          <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <div className="col-12 mb-3">
                            <label>Package Name</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Package Name"
                              value={packageName}
                              onChange={(e) => setPackageName(e.target.value)}
                              required
                            />
                            <div className="valid-feedback">Looks good!</div>
                          </div>
                          <div className="col-12 mb-3">
                            <label>Package Min Amount in dollar</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Package Minimum Amount"
                              value={packageMinAmount}
                              onChange={(e) =>
                                setPackageMinAmount(e.target.value)
                              }
                              required
                            />
                          </div>
                          <div className="col-12 mb-3">
                            <label>Package Max Amount in dollar</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Package Maximum Amount"
                              value={packageMaxAmount}
                              onChange={(e) =>
                                setPackageMaxAmount(e.target.value)
                              }
                              required
                            />
                          </div>
                          <div className="col-12 mb-3">
                            <label>Profit</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Package Profit"
                              value={profit}
                              onChange={(e) => setProfit(e.target.value)}
                              required
                            />
                          </div>
                          <div className="col-12 mb-3">
                            <label>Duration</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Duration"
                              value={duration}
                              onChange={(e) => setDuration(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            data-dismiss="modal"
                          >
                            Close
                          </button>
                          <button
                            type="submit"
                            className="btn btn-success"
                            onClick={onCreatePackage}
                          >
                            Add Package
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
                {/* ADD INVESTMENT PACKAGE
                    < Button trigger modal                                                 
                    Modal  */}
                <form onSubmit={handleSubmit}>
                  <div
                    className="modal fade"
                    id="add-Investment-package"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalCenterTitle"
                    aria-hidden="true"
                    data-backdrop="false"
                  >
                    <div
                      className="modal-dialog modal-dialog-centered"
                      role="document"
                    >
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5
                            className="modal-title"
                            id="exampleModalLongTitle"
                          >
                            Add New Package
                          </h5>
                          <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <div className="col-12 mb-3">
                            <label>Package Name</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Package Name"
                              value={packageName}
                              onChange={(e) => setPackageName(e.target.value)}
                              required
                            />
                            <div className="valid-feedback">Looks good!</div>
                          </div>
                          <div className="col-12 mb-3">
                            <label>Package Min Amount in dollar</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Package Minimum Amount"
                              value={packageMinAmount}
                              onChange={(e) =>
                                setPackageMinAmount(e.target.value)
                              }
                              required
                            />
                          </div>
                          <div className="col-12 mb-3">
                            <label>Package Max Amount in dollar</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Package Maximum Amount"
                              value={packageMaxAmount}
                              onChange={(e) =>
                                setPackageMaxAmount(e.target.value)
                              }
                              required
                            />
                          </div>
                          <div className="col-12 mb-3">
                            <label>Profit</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Package Profit"
                              value={profit}
                              onChange={(e) => setProfit(e.target.value)}
                              required
                            />
                          </div>
                          <div className="col-12 mb-3">
                            <label>Duration</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Duration"
                              value={duration}
                              onChange={(e) => setDuration(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            data-dismiss="modal"
                          >
                            Close
                          </button>
                          <button
                            type="submit"
                            className="btn btn-success"
                            onClick={onCreatePackage}
                          >
                            Add Package
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
                {/* /* <!-- MODAL WALLET BALANCE -->
                    <!-- Button trigger modal -->
                                                
                        <!-- Modal --> */}{" "}
                <div
                  className="modal fade"
                  id="transaction-data"
                  tabIndex="-1"
                  role="dialog"
                  aria-labelledby="exampleModalCenterTitle"
                  aria-hidden="true"
                  data-backdrop="false"
                >
                  <div
                    className="modal-dialog modal-dialog-centered"
                    role="document"
                  >
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">
                          Add User Transaction data
                        </h5>
                        <button
                          type="button"
                          className="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <div className="col-12 mb-3">
                          <label for="validationCustom01">Email Address</label>
                          <input
                            type="Email"
                            className="form-control"
                            id="validationCustom01"
                            placeholder="Email"
                            value={trxnEmail}
                            onChange={(e) => setTrxnEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-12 mb-3">
                          <label for="validationCustom02">Date</label>
                          <input
                            type="date"
                            className="form-control"
                            id="validationCustom02"
                            placeholder="Enter Date"
                            value={trxnDate}
                            onChange={(e) => setTrxnDate(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-12 mb-3">
                          <label for="validationCustom02">Amount</label>
                          <input
                            type="number"
                            className="form-control"
                            id="validationCustom02"
                            placeholder="Amount in Dollar"
                            value={trxnAmount}
                            onChange={(e) => setTrxnAmount(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-12 mb-3">
                          <label for="validationCustom02">Category</label>
                          <input
                            type="text"
                            className="form-control"
                            id="validationCustom02"
                            placeholder="Account Debit, Account Credit"
                            value={trxnCategory}
                            onChange={(e) => setTrxnCategory(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-12 mb-3">
                          <label for="validationCustom02">Trxn ID</label>
                          <input
                            type="text"
                            className="form-control"
                            id="validationCustom02"
                            placeholder="Enter Trxn ID"
                            value={trxnId}
                            onChange={(e) => setTrxnId(e.target.value)}
                          />
                        </div>
                        <div className="col-12 mb-3">
                          <label for="validationCustom02">Status</label>
                          <input
                            type="select"
                            className="form-control"
                            id="validationCustom02"
                            placeholder="Pending or Completed"
                            value={trxnStatus}
                            onChange={(e) => setTrxnStatus(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-dismiss="modal"
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={onCreateTrxn}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* ADD ADMIN
                    < Button trigger modal                                                 
                    Modal  */}
                <form onSubmit={handleSubmit}>
                  <div
                    className="modal fade"
                    id="add-admin"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalCenterTitle"
                    aria-hidden="true"
                    data-backdrop="false"
                  >
                    <div
                      className="modal-dialog modal-dialog-centered"
                      role="document"
                    >
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5
                            className="modal-title"
                            id="exampleModalLongTitle"
                          >
                            Add New Admin
                          </h5>
                          <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <div className="col-12 mb-3">
                            <label>User Email address</label>
                            <input
                              type="email"
                              className="form-control"
                              placeholder="Email Address"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                            <div className="valid-feedback">Looks good!</div>
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            data-dismiss="modal"
                          >
                            Close
                          </button>
                          <button
                            type="submit"
                            className="btn btn-success"
                            onClick={onCreateAdmin}
                          >
                            Add Admin
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
