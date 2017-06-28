package admin;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

import util.Pessoa;


@Entity
@DiscriminatorValue("admin")
public class Admin  extends Pessoa{

}
