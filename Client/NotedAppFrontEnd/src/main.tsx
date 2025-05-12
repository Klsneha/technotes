import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.tsx'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import { store } from './app/store.ts';

store.dispatch({ type: 'apiSlice/initialize' });
createRoot(document.getElementById('root')!).render(

  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
