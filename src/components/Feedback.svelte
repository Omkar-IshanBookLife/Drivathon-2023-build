<script lang="ts">
    import { navigate } from "svelte-navigator";
    import { currentUser, pb } from "../pocketbase";
    import { onMount } from "svelte";

    let email: string;
    let feedback: string;

    onMount(() => {
        if($currentUser){
            email = $currentUser.email
        }
    })

    async function sendFeedback() {
        const data = {email, feedback}
        await pb.collection("feedbacks").create(data)
        alert("Thank You, Feedback Saved Successfully!")
        navigate("/")
    }
</script>

<main>
    <div class="text-center mb-4">
        <h3>Feedback Page</h3>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure
            voluptatum doloribus soluta doloremque molestias libero sed.
        </p>
    </div>
    <form class="px-5" on:submit|preventDefault>
        <div class="mb-3">
            <label for="exampleFormControlInput1" class="form-label"
                >Email address</label
            >
            <input
                type="email"
                class="form-control"
                id="exampleFormControlInput1"
                bind:value={email}
            />
            <div id="emailHelp" class="form-text">
                We'll never share your email with anyone else.
            </div>
        </div>
        <div class="mb-3">
            <label for="exampleFormControlTextarea1" class="form-label"
                >Feedback</label
            >
            <textarea
                class="form-control"
                id="exampleFormControlTextarea1"
                rows="5"
                placeholder="Provid Your Valuable Feedback Here!"
                bind:value={feedback}
            />
        </div>
        <div class="d-grid gap-2">
            <button class="btn btn-primary" type="submit" on:click={sendFeedback}>Submit</button>
        </div>
    </form>
    <hr />
    <div class="text-center">
        <p>
            <a href="mailto:ogamethorns@gmail.com" class="text-info"
                >ogamethorns@gmail.com</a
            >
        </p>
        <p class="mb-2">
            Kupwad Road Sangli 416416 <br />
            Ajinkya Society, Gurukrupa Hospital
        </p>
        <p>
            <i class="fab fa-google me-1" />
            <i class="fab fa-facebook me-1" />
            <i class="fab fa-github me-1" />
            <i class="fab fa-discord" />
        </p>
    </div>
</main>
