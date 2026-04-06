import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'
import axios from "axios";
import api from "./lib/core/data/remote/api.ts";

axios.defaults.baseURL = api;
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.headers.common['Accept'] = 'application/json';

const app = mount(App, {
  target: document.getElementById('app')!,
});

export default app