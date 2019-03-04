# Pour créer une nouvelle branche qui va copier la branche d’origine : 
	“git checkout -b ‘le_nom_de_votre_branche_annexe’”

	Bien penser a ‘commit’ avant de changer de branche ! Sinon les fichiers crees/modifies se baladeront avec vous.

# Pour retourner sur une branche existante : 
“git checkout ‘le_nom_de_la_branche_souhaitée’ ”
(Si vous ne savez pas quelle branche existe ou non, tapper : “git branch”)

# Pour fusionner votre branche annexe sur la branche Master : 
	- d’abord on ‘git push’ la branche annexe.
	- puis on se rend sur la branche principale : “git checkout ‘le_nom’ “.
	- On ‘git pull’ au cas ou quelqu’un ai deja modifié le contenu.
	- Ensuite on synchronise les deux branche : “git merge ‘le_nom_de_votre_branche_annexe’ “.
	- Puis ‘git push’.
	- Et pour finir vous pouvez supprimer votre branche annexe : “git branch -d ‘le_nom_de_votre_branche_annexe’ ” puis “git push origin --delete ‘le_nom_de_votre_branche_annexe’ “.

