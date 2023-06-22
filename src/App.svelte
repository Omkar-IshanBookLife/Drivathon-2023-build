<script lang="ts">
  import { Link, Router, Route, navigate } from "svelte-navigator";
  import { pb, currentUser } from "./pocketbase";
  import Home from "./components/Home.svelte";
  import Drives from "./components/Drives.svelte";
  import About from "./components/About.svelte";
  import Drive from "./components/Drive.svelte";
  import New from "./components/New.svelte";
  import Profile from "./components/Profile.svelte";

  let loginEmailAddr: string;
  let loginPassword: string;
  let signUpEmailAddr: string;
  let signUpPassword: string;
  let signUpUsername: string;

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

  async function loginWithGoogle(){
    const user = await pb.collection("users").authWithOAuth2({ provider: "google" })
    console.log(user)
  }

  async function logout() {
    await pb.authStore.clear();
    navigate("/", {replace:true})
    window.location.reload()
  }
</script>

<Router>
  <main>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
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
                <Link class="nav-link" to="/about">About</Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link" to="/profile">Profile</Link>
              </li>
            </ul>
            <div class="ms-auto d-flex">
              <button class="btn btn-danger" type="button" data-bs-toggle="modal"
              data-bs-target="#logoutModal"
                >Logout</button
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
              <button class="btn btn-success" on:click={loginWithGoogle}>Login With <i class="fab fa-google"></i></button>
            </div>
          {/if}
        </div>
      </div>
    </nav>

    <section class="p-5 my-4">
      <div class="container">
        {#if $currentUser}
          <Route path="/" component={Home} />
          <Route path="drives" component={Drives} />
          <Route path="drive/:id" component={Drive} />
          <Route path="new" component={New} />
          <Route path="about" component={About} />
          <Route path="profile" component={Profile} />
        {:else}
          <Route path="/" component={Home} />
          <Route path="drives" component={Drives} />
          <Route path="drive/:id" component={Drive} />
          <Route path="about" component={About} />
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
    <div class="modal fade" id="logoutModal" tabindex="-1" aria-labelledby="logoutModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="logoutModalLabel">Modal title</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            Are You Sure You Want To Logout?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" on:click={logout} data-bs-dismiss="modal">Logout</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</Router>
