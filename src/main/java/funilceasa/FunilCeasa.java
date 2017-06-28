package funilceasa;

import java.sql.Date;

import com.fasterxml.jackson.annotation.JsonView;

public class FunilCeasa {
	
	//Se interessaram no primeiro contato
	
	
	//interessaram no primeiro contato
	public static final int INTERESSOU_PRIMEIRO_CONTATO = 1;
	
	//Na se interessaram o primeiro contato
	public static final int NAO_INTERESSOU_PRIMEIRO_CONTATO = 0;
	
	//Data de conclusão da compra
	//Utilizado para medir tempo médio de uma venda (dataFinalizou - cadataCadastro)
	@JsonView(util.Views.Public.class)
	private Date dataFinalizouCompra;	
	
	//Status inicial (Se interessou ou não se interessou)
	@JsonView(util.Views.Public.class)
	private int interessouPrimeiroContato;
	
	@JsonView(util.Views.Public.class)
    private String login;
	
	@JsonView(util.Views.Public.class)
    private String nome;
	
	
	@JsonView(util.Views.Public.class)
	private String telefone;
	
	@JsonView(util.Views.Public.class)
	private String email;
	
	@JsonView(util.Views.Public.class)
	private String produtos;
	
	
	@JsonView(util.Views.Public.class)
	private String formaContato;
	
	
	@JsonView(util.Views.Public.class)
	private String endereco;
	
	
	
	public String getEndereco() {
		return endereco;
	}
	public void setEndereco(String endereco) {
		this.endereco = endereco;
	}
	public String getFormaContato() {
		return formaContato;
	}
	public void setFormaContato(String formaContato) {
		this.formaContato = formaContato;
	}
	public String getLogin() {
		return login;
	}
	public void setLogin(String login) {
		this.login = login;
	}
	
    public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	}
	public String getTelefone() {
		return telefone;
	}
	public void setTelefone(String telefone) {
		this.telefone = telefone;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getProdutos() {
		return produtos;
	}
	public void setProdutos(String produtos) {
		this.produtos = produtos;
	}
	
	public int getInteressouPrimeiroContato() {
		return interessouPrimeiroContato;
	}
	public void setInteressouPrimeiroContato(int interessouPrimeiroContato) {
		this.interessouPrimeiroContato = interessouPrimeiroContato;
	}
	

	public Date getDataFinalizouCompra() {
		return dataFinalizouCompra;
	}
	public void setDataFinalizouCompra(Date dataFinalizouCompra) {
		this.dataFinalizouCompra = dataFinalizouCompra;
	}
	
	

}
