package relatorio;

import java.util.ArrayList;
import com.fasterxml.jackson.annotation.JsonView;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class Projecao {
	
	@JsonView(util.Views.Public.class)
	private String label;
	
	@JsonView(util.Views.Public.class)
	private ArrayList<String> series;
	
	@JsonView(util.Views.Public.class)
	private ArrayList<String> labels;
	
	@JsonView(util.Views.Public.class)
	private ArrayList<Object> data;
	
	

	
}
