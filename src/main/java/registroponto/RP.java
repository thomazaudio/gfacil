package registroponto;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.annotation.JsonView;

import crud.CrudClass;
import util.Pessoa;

@Entity
public class RP  extends CrudClass{
    
	@Column(columnDefinition="varchar(255) default 'Jornada de Trabalho'")
	@JsonView(util.Views.Public.class)
    private String descricaoAtividade;
	
	
	public Date getDataInicio() {
		return dataInicio;
	}

	public void setDataInicio(Date dataInicio) {
		this.dataInicio = dataInicio;
	}

	public Date getDataFim() {
		return dataFim;
	}

	public void setDataFim(Date dataFim) {
		this.dataFim = dataFim;
	}

	@JsonView(util.Views.Public.class)
	@Temporal(TemporalType.TIMESTAMP)
    private Date dataInicio;
	
	@JsonView(util.Views.Public.class)
	@Temporal(TemporalType.TIMESTAMP)
    private Date dataFim;
	
	
	@ManyToOne
	@JoinColumn(name="id_pessoa",nullable=true)
	@JsonView(util.Views.Public.class)
	private Pessoa pessoa;//Pessoa para qual o RP se destina
	
	public String getDescricaoAtividade() {
		return descricaoAtividade;
	}

	public void setDescricaoAtividade(String descricaoAtividade) {
		this.descricaoAtividade = descricaoAtividade;
	}

	

	public Pessoa getPessoa() {
		return pessoa;
	}

	public void setPessoa(Pessoa pessoa) {
		this.pessoa = pessoa;
	}

	
}
