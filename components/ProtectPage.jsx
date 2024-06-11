import { useSession } from "next-auth/react";

export default function ProtectPage({ children }) {
  const { data: session, loading } = useSession();

  // Verificar se o usuário está autenticado
  if (loading) {
    // Exibir um indicador de carregamento enquanto verifica o estado de autenticação
    return <div>Loading...</div>;
  }

  if (!session) {
    // Redirecionar o usuário para a página de login ou exibir uma mensagem de erro
    return <div>You need to log in</div>;
  }

  // Renderizar o conteúdo do layout protegido
  return <div>{children}</div>;
}
