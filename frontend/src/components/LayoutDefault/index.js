import Header from './Header';
import Main from './Main';
import Footer from './Footer';

function LayoutDefault() {
  return (
    <>
      <header>
        <Header />
      </header>

      <Main />
      <footer>
        <Footer />
      </footer>
    </>
  );
}
export default LayoutDefault;
