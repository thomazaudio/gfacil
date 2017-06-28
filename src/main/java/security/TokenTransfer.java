package security;

import com.fasterxml.jackson.annotation.JsonView;

import config.Config;
import usersystem.UserSystem;

public class TokenTransfer
{
	@JsonView(util.Views.Public.class)
	private final String token;

	@JsonView(util.Views.Public.class)
	private UserSystem usuarioSistema;
	
	@JsonView(util.Views.Public.class)
	private Config config;


	public TokenTransfer(String token,UserSystem usuario, Config config)
	{
		this.setUsuarioSistema(usuario);
		this.token = token;
		this.config = config;
	}
	
	public Config getConfig() {
		return config;
	}

	public void setConfig(Config config) {
		this.config = config;
	}

	public UserSystem getUsuarioSistema() {
		return usuarioSistema;
	}

	public void setUsuarioSistema(UserSystem usuarioSistema) {
		this.usuarioSistema = usuarioSistema;
	}

	public String getToken()
	{
		return this.token;
	}

}