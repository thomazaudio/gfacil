package estadoscidades;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonView;

@Entity
public class Cidade {

	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@JsonView(util.Views.Public.class)
	private long id;
	
	@JsonView(util.Views.Public.class)
	private long idEstado;
	
	@JsonView(util.Views.Public.class)
	private long codigoMunicipio;
	
	@JsonView(util.Views.Public.class)
	private String nome;
	
	@JsonView(util.Views.Public.class)
    private String uf;
	
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public long getIdEstado() {
		return idEstado;
	}

	public void setIdEstado(long idEstado) {
		this.idEstado = idEstado;
	}

	public long getCodigoMunicipio() {
		return codigoMunicipio;
	}

	public void setCodigoMunicipio(long codigoMunicipio) {
		this.codigoMunicipio = codigoMunicipio;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getUf() {
		return uf;
	}

	public void setUf(String uf) {
		this.uf = uf;
	}

	
}
