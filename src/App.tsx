import { Show, createSignal, onMount } from "solid-js";
import logo from "./assets/logo.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { createStore } from "solid-js/store";
import { locale, platform } from "@tauri-apps/plugin-os";

function App() {
  const [system, setSystem] = createStore<
    Record<"platform" | "locale", null | string>
  >({
    platform: null,
    locale: null,
  });
  const [greetMsg, setGreetMsg] = createSignal("");
  const [name, setName] = createSignal("");

  onMount(async () => {
    const plat = await platform();
    const loc = await locale();

    setSystem({ platform: plat, locale: loc });
  });

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name: name() }));
  }

  return (
    <div class="container">
      <h1>
        <Show when={system.platform}>{(p) => <>{p} - </>}</Show>
        <Show when={system.locale}>{(l) => <>{l} - </>}</Show>
      </h1>

      <div class="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" class="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" class="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://solidjs.com" target="_blank">
          <img src={logo} class="logo solid" alt="Solid logo" />
        </a>
      </div>

      <p>Click on the Tauri, Vite, and Solid logos to learn more.</p>

      <form
        class="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>

      <p>{greetMsg()}</p>
    </div>
  );
}

export default App;
