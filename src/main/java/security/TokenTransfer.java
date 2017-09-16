package security;

import java.util.Date;

import logisticareversa.LogisticaReversa;
import lombok.Getter;
import lombok.Setter;
import movimentacao.Movimentacao;

import com.fasterxml.jackson.annotation.JsonView;

import config.Config;
import usersystem.UserSystem;
@Getter @Setter
public class TokenTransfer
{
	@JsonView(util.Views.Public.class)
	private final String token;

	@JsonView(util.Views.Public.class)
	private UserSystem usuarioSistema;
	
	@JsonView(util.Views.Public.class)
	private Config config;
	
	@JsonView(util.Views.Public.class)
	private Date dataBackEnd;


	public TokenTransfer(String token,UserSystem usuario, Config config)
	{
		this.setUsuarioSistema(usuario);
		this.token = token;
		this.config = config;
		this.dataBackEnd = new Date();
	}
	


}