package usersystem;
import com.fasterxml.jackson.annotation.JsonView;
import config.Config;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UserSystem {

	//Id da Pessoa no sistema
	@JsonView(util.Views.Public.class)
	private long id;

	//Itens não transortados via JSON
	private String banco;
	private String password;

	@JsonView(util.Views.Public.class)
	private String login;

	//Identifica se a senha padrão não foi alterada (defaultPassword==1)
	@JsonView(util.Views.Public.class)
	private boolean defaultPassword;

	//Identifica se o usuário já assistiu o tutorial básico do sistema
	@JsonView(util.Views.Public.class)
	private boolean assistiuVideoApresentacao;

	@JsonView(util.Views.Public.class)
	private String email;


	//Nome da Pessoa no sistema
	@JsonView(util.Views.Public.class)
	private String nome;

	//Permissões do usuário
	@JsonView(util.Views.Public.class)
	private String permissoes;


	//Idetificação da filial corrente
	@JsonView(util.Views.Public.class)
	private long currentFilialId;

	//Configurações do úsuario
	@JsonView(util.Views.Public.class)
	private  Config config;


}
