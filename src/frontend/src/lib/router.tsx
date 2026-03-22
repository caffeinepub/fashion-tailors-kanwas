import {
  type AnchorHTMLAttributes,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface RouterCtx {
  path: string;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterCtx>({
  path: "/",
  navigate: () => {},
});

export function BrowserRouter({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = useCallback((to: string) => {
    window.history.pushState({}, "", to);
    setPath(to);
  }, []);

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useNavigate() {
  const { navigate } = useContext(RouterContext);
  return navigate;
}

export function useLocation() {
  const { path } = useContext(RouterContext);
  return { pathname: path };
}

interface RouteProps {
  path: string;
  element: ReactNode;
  end?: boolean;
}

function matchRoute(
  routePath: string,
  currentPath: string,
  end?: boolean,
): boolean {
  if (end) return routePath === currentPath;
  return currentPath === routePath || currentPath.startsWith(`${routePath}/`);
}

export function Routes({ children }: { children: ReactNode }) {
  const { path } = useContext(RouterContext);
  const childArray = Array.isArray(children) ? children : [children];

  for (const child of childArray as React.ReactElement<RouteProps>[]) {
    if (!child || !child.props) continue;
    const { path: routePath, element, end } = child.props;
    if (routePath === "*") continue;
    if (matchRoute(routePath, path, end ?? routePath === "/")) {
      return <>{element}</>;
    }
  }

  for (const child of childArray as React.ReactElement<
    RouteProps & { path: string }
  >[]) {
    if (!child || !child.props) continue;
    if (child.props.path === "*") return <>{child.props.element}</>;
  }

  return null;
}

export function Route(_props: RouteProps) {
  return null;
}

export function Navigate({ to, replace }: { to: string; replace?: boolean }) {
  const { navigate } = useContext(RouterContext);
  useEffect(() => {
    if (replace) {
      window.history.replaceState({}, "", to);
    }
    navigate(to);
  });
  return null;
}

type BaseAnchorProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "className"
>;

interface LinkProps extends BaseAnchorProps {
  to: string;
  end?: boolean;
  children: ReactNode;
  className?: string | ((opts: { isActive: boolean }) => string);
  "data-ocid"?: string;
}

export function NavLink({
  to,
  end,
  children,
  className,
  onClick,
  ...rest
}: LinkProps) {
  const { path, navigate } = useContext(RouterContext);
  const isActive = matchRoute(to, path, end ?? to === "/");

  const resolvedClassName =
    typeof className === "function"
      ? className({ isActive })
      : (className ?? "");

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onClick) onClick(e);
    navigate(to);
  };

  return (
    <a href={to} className={resolvedClassName} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}

export function Link({ to, children, className, onClick, ...rest }: LinkProps) {
  const { navigate } = useContext(RouterContext);

  const resolvedClassName =
    typeof className === "function"
      ? className({ isActive: false })
      : (className ?? "");

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onClick) onClick(e);
    navigate(to);
  };

  return (
    <a href={to} className={resolvedClassName} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
