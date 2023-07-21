<!-- svelte-ignore a11y-missing-attribute -->
<!-- svelte-ignore a11y-click-events-have-key-events -->

<script lang="ts">
  import { Link, Router, Route, navigate } from "svelte-navigator";
  import { pb, currentUser, loading } from "./pocketbase";
  import Home from "./components/Home.svelte";
  import Drives from "./components/Drives.svelte";
  import About from "./components/About.svelte";
  import Drive from "./components/Drive.svelte";
  import New from "./components/New.svelte";
  import Profile from "./components/Profile.svelte";
  import Search from "./components/Search.svelte";
  import Chat from "./components/Chat.svelte";
  import Loader from "./components/Loader.svelte";
    import Feedback from "./components/Feedback.svelte";

  let loginEmailAddr: string;
  let loginPassword: string;
  let signUpEmailAddr: string;
  let signUpPassword: string;
  let signUpUsername: string;
  let search: string;
  let forgotPasswordEmail: string;

  async function login() {
    const user = await pb
      .collection("users")
      .authWithPassword(loginEmailAddr, loginPassword);
    console.log(user);
  }

  async function signUp() {
    try {
      const data = {
        email: signUpEmailAddr,
        password: signUpPassword,
        passwordConfirm: signUpPassword,
        name: signUpUsername,
      };
      await pb.collection("users").create(data);
      const user = await pb
        .collection("users")
        .authWithPassword(signUpEmailAddr, signUpPassword);
      console.log(user);
    } catch (err) {
      console.error(err);
    }
  }

  async function loginWithGoogle() {
    const user = await pb
      .collection("users")
      .authWithOAuth2({ provider: "google" });
    console.log(user);
  }

  async function loginWithFacebook() {
    const user = await pb
      .collection("users")
      .authWithOAuth2({ provider: "facebook" });
    console.log(user);
  }

  async function loginWithDiscord() {
    const user = await pb
      .collection("users")
      .authWithOAuth2({ provider:"discord" })
    console.log(user)
  }

  async function loginWithGithub() {
    const user = await pb
      .collection("users")
      .authWithOAuth2({ provider:"github" })
    console.log(user)
  }

  async function logout() {
    await pb.authStore.clear();
    navigate("/", { replace: true });
    window.location.reload();
  }

  async function searchResultPage() {
    navigate(`/search/${search}`, { replace: true });
    window.location.reload();
  }

  async function requestPasswordChange() {
    window.alert("Password Change Email Sent");
    await pb.collection("users").requestPasswordReset(loginEmailAddr);
  }
</script>

<Router>
  <main>
    <nav class="navbar navbar-expand-lg navbar-dark bg-info">
      <div class="container">
        <a class="navbar-brand" href="/">Drivathon 🍃</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon" />
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          {#if $currentUser}
            <ul class="navbar-nav">
              <li class="nav-item">
                <Link class="nav-link active" aria-current="page" to="/"
                  >Home</Link
                >
              </li>
              <li class="nav-item">
                <Link class="nav-link" to="/drives">Drives</Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link" to="/new">New</Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link" to="/feedback">Feedback</Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link" to="/about">About</Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link" to="/profile">Profile</Link>
              </li>
            </ul>
            <div class="ms-auto d-flex">
              <form class="d-flex me-2" role="search" on:submit|preventDefault>
                <input
                  class="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  bind:value={search}
                />
                <button
                  class="btn btn-success"
                  type="submit"
                  on:click={searchResultPage}>Search</button
                >
              </form>
              <button
                class="btn btn-danger"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#logoutModal">Logout</button
              >
            </div>
          {:else}
            <ul class="navbar-nav">
              <li class="nav-item">
                <Link class="nav-link active" aria-current="page" to="/"
                  >Home</Link
                >
              </li>
              <li class="nav-item">
                <Link class="nav-link" to="/drives">Drives</Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link" to="/feedback">Feedback</Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link" to="/about">About</Link>
              </li>
            </ul>
            <div class="ms-auto d-flex">
              <div class="btn-group me-2" role="group">
                <button
                  class="btn btn-success"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#signupModal">Sign Up</button
                >
                <button
                  class="btn btn-success"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#loginModal">Login</button
                >
              </div>
              <div class="dropdown">
                <button class="btn btn-success dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Sign In With
                </button>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" on:click={loginWithGoogle}>Google <i class="fab fa-google" /></a></li>
                  <li><a class="dropdown-item" on:click={loginWithFacebook}>Facebook <i class="fab fa-facebook" /></a></li>
                  <li><a class="dropdown-item" on:click={loginWithGithub}>Github <i class="fab fa-github" /></a></li>
                  <li><a class="dropdown-item" on:click={loginWithDiscord}>Discord <i class="fab fa-discord" /></a></li>
                </ul>
              </div>
            </div>
          {/if}
        </div>
      </div>
    </nav>

    <section class="p-5 my-4">
      <div class="container">
        {#if $loading}
          <div class="d-flex align-items-center justify-content-center">
            <Loader />
          </div>
        {:else if $currentUser}
          <Route path="/" component={Home} />
          <Route path="drives" component={Drives} />
          <Route path="drive/:id" component={Drive} />
          <Route path="new" component={New} />
          <Route path="about" component={About} />
          <Route path="profile" component={Profile} />
          <Route path="search/:search" component={Search} />
          <Route path="chat/:id" component={Chat} />
          <Route path="feedback" component={Feedback}/>
        {:else}
          <Route path="/" component={Home} />
          <Route path="drives" component={Drives} />
          <Route path="drive/:id" component={Drive} />
          <Route path="about" component={About} />
          <Route path="feedback" component={Feedback}/>
        {/if}
      </div>
    </section>

    <div
      class="modal fade"
      id="signupModal"
      tabindex="-1"
      aria-labelledby="signupModelLabelledby"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <form on:submit|preventDefault>
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Sign Up</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label"
                  >Username</label
                >
                <input
                  type="text"
                  class="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  bind:value={signUpUsername}
                />
              </div>
              <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label"
                  >Email address</label
                >
                <input
                  type="email"
                  class="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  bind:value={signUpEmailAddr}
                />
              </div>
              <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label"
                  >Password</label
                >
                <input
                  type="password"
                  class="form-control"
                  id="exampleInputPassword1"
                  bind:value={signUpPassword}
                />
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal">Close</button
              >
              <button
                type="submit"
                class="btn btn-primary"
                data-bs-dismiss="modal"
                on:click={signUp}>Sign Up</button
              >
            </div>
          </form>
        </div>
      </div>
    </div>
    <div
      class="modal fade"
      id="loginModal"
      tabindex="-1"
      aria-labelledby="loginModelLabelledby"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <form on:submit|preventDefault>
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Login</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div class="modal-body">
              <form>
                <div class="mb-3">
                  <label for="exampleInputEmail1" class="form-label"
                    >Email address</label
                  >
                  <input
                    type="email"
                    class="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    bind:value={loginEmailAddr}
                  />
                </div>
                <div class="mb-3">
                  <label for="exampleInputPassword1" class="form-label"
                    >Password</label
                  >
                  <input
                    type="password"
                    class="form-control"
                    id="exampleInputPassword1"
                    bind:value={loginPassword}
                  />
                </div>
                <div>
                  <a
                    data-bs-toggle="modal"
                    data-bs-target="#forgotPasswordModal"
                    href="/">Forgot Password?</a
                  >
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal">Close</button
              >
              <button
                type="submit"
                class="btn btn-primary"
                data-bs-dismiss="modal"
                on:click={login}>Login</button
              >
            </div>
          </form>
        </div>
      </div>
    </div>
    <div
      class="modal fade"
      id="logoutModal"
      tabindex="-1"
      aria-labelledby="logoutModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="logoutModalLabel">Logout Modal</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div class="modal-body">Are You Sure You Want To Logout?</div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal">Close</button
            >
            <button
              type="button"
              class="btn btn-primary"
              on:click={logout}
              data-bs-dismiss="modal">Logout</button
            >
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal fade"
      id="forgotPasswordModal"
      tabindex="-1"
      aria-labelledby="logoutModalLabel"
      aria-hidden="true"
    >
      <form on:submit|preventDefault>
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="forgotPasswordModal">
                Forgot Password
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div class="modal-body">
              <div>
                <label for="exampleFormControlInput1" class="form-label"
                  >Email Address Associated with Email Address</label
                >
                <input
                  type="email"
                  class="form-control"
                  id="exampleFormControlInput1"
                  placeholder="name@example.com"
                  bind:value={forgotPasswordEmail}
                />
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal">Close</button
              >
              <button
                type="submit"
                class="btn btn-primary"
                on:click={requestPasswordChange}
                data-bs-dismiss="modal">Forgot Password</button
              >
            </div>
          </div>
        </div>
      </form>
    </div>
  </main>
</Router>
