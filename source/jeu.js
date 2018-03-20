(function () {  // IIFE
    "use strict";

    //Variable pour référencer le jeu
    var leJeu;
	
    //Constantes du jeu
    var TAILLE_TUILES = 64;
    var NB_COLONNES = 8;
    var NB_TUILES_PAR_RANGE = 4;
    var NB_LIGNES = 8;
    var NB_TUILES = NB_COLONNES * NB_LIGNES;
    var NB_DAMES = 12;
    
    //Variables pour le jeu 
    var joueurGagnant = "";

    //On créera le jeu quand la page HTML sera chargée
    window.addEventListener("load", function () {
        leJeu= new Phaser.Game(960, 640);

        //Ajout des états du jeu, et sélection de l'état au démarrage
        leJeu.state.add("Demarrage", Demarrage);
        leJeu.state.add("ChargementMedias", ChargementMedias);
        leJeu.state.add("IntroJeu", IntroJeu);
        leJeu.state.add("Instructions", Instructions);
        leJeu.state.add("Jeu", Jeu);
        leJeu.state.add("FinJeu", FinJeu);

        //Définir l'écran (state) au démarrage
        leJeu.state.start("Demarrage");

    }, false);
    
    ////////////////////////////////
    //      Demarrage             //
    ////////////////////////////////

    /**
    * Classe permettant de définir l'écran (state)
    * pour les ajustements au démarrage du jeu
    */
	
	var Demarrage = function(){};
    
    Demarrage.prototype = {
        init : function (){
            //Adapter le jeu à l'écran
            leJeu.scale.pageAlignHorizontally = true;  
            leJeu.scale.pageAlignVertically = true;
            leJeu.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        },
		
		preload : function () {
           
        }, 
        
        create: function () {
			//Quand les ajustements sont faits - on charge les médias
            leJeu.state.start("ChargementMedias");
        }       
    };


    ////////////////////////////////
    //      ChargementMedias      //
    ////////////////////////////////

    /**
    * Classe permettant de définir l'écran (state)
    * pour le chargement des médias
    */

    var ChargementMedias = function(){};

    ChargementMedias.prototype = {

        preload : function(){
			//Chemin commun au chargement de toutes les images
			leJeu.load.path = "medias/img/";
			
            //Chargement des feuilles de sprites
            leJeu.load.spritesheet("casesEchec", "caseEchequier.png", TAILLE_TUILES, TAILLE_TUILES);
            leJeu.load.spritesheet("dames", "dames.png", TAILLE_TUILES, TAILLE_TUILES);
            leJeu.load.spritesheet("boutonDemarrage", "boutonJouer.png", 360, 80);
            leJeu.load.spritesheet("boutonInstructions", "boutonInstructions.png", 360, 80);
            leJeu.load.spritesheet("boutonRetour", "boutonRetour.png", 360, 80);
            leJeu.load.spritesheet("boutonRejouer", "boutonRejouer.png", 360, 80);
            
            
            //Chargement des images
            leJeu.load.image("introImg", "introDames.png", 960, 640);
            leJeu.load.image("instructionsImg", "instructionsDames.png", 960, 640);
            leJeu.load.image("finBleu", "ecranFinBleu.png", 960, 640);
            leJeu.load.image("finRouge", "ecranFinRouge.png", 960, 640);
            
            
			//Chemin commun au chargement de tous les sons
			leJeu.load.path = "medias/audio/";
            
            //Charger les sons
            leJeu.load.audio("sonDames", ["sonDames.mp3", "sonDames.ogg"]);
            
        },

        create: function(){
            //Quand le chargement des actifs est complété - on affiche l'écran du jeu
            leJeu.state.start("IntroJeu");
        }
    };
    
    ////////////////////////////////
    //          IntroJeu          //
    ////////////////////////////////

    /**
     * Classe permettant de définir l'écran (state)
     * pour la scène d'intro du jeu
     */
    
    var IntroJeu = function (){};

    IntroJeu.prototype = {
        
        create: function(){
            //Faire apparaître l'image d'intro
            var imgIntro = leJeu.add.image(0,0, "introImg");
            
            //Boutons
            //bouton pour jouer
            var boutonJouer = leJeu.add.button(leJeu.width/2, leJeu.height/2-50, "boutonDemarrage", this.jouerAuJeu, this,1,0,2,0);
            boutonJouer.anchor.set(0.5);
            //bouton pour aller à la page d'instructions
            var boutonInstructions = leJeu.add.button(leJeu.width/2, leJeu.height/2+50, "boutonInstructions", this.commentJouer, this,1,0,2,0);
            boutonInstructions.anchor.set(0.5);

        },
        
        //Lance le jeu
        jouerAuJeu: function(){
            //Démarrer l'écran du jeu
            leJeu.state.start("Jeu");
        },
        //La la page d'instructions
        commentJouer: function(){
            //Aller à l'incran instruction
            leJeu.state.start("Instructions");
        }

    }; // Fin IntroJeu.prototype
    
    ////////////////////////////////
    //          Instructions      //
    ////////////////////////////////

    /**
     * Classe permettant de définir l'écran (state)
     * pour la scène d'instructions du jeu
     */
    
    var Instructions = function (){};

    Instructions.prototype = {
        
        create: function(){
            
            var imgInstruction = leJeu.add.image(0,0, "instructionsImg");
            
            //Boutons
            var boutonRetour = leJeu.add.button(leJeu.width/2, leJeu.height-125, "boutonRetour", this.retourIntro, this,1,0,2,0);
            boutonRetour.anchor.set(0.5);
        },
        //Permet de revenir à la page d'intro du jeu
        retourIntro: function(){
            //Revenir à l'écran d'intro
            leJeu.state.start("IntroJeu");
        }

    }; // Fin Instruction.prototype


    ////////////////////////////////
    //          EcranJeu         //
    ////////////////////////////////

    /**
    * Classe permettant de définir l'écran (state)
    * pour la scène du jeu...
    */

    var Jeu = function (){
        //L'échiquier
        this.damier = [[0,1,0,1,0,1,0,1],
                      [1,0,1,0,1,0,1,0],
                      [0,1,0,1,0,1,0,1],
                      [0,0,0,0,0,0,0,0],
                      [0,0,0,0,0,0,0,0],
                      [2,0,2,0,2,0,2,0],
                      [0,2,0,2,0,2,0,2],
                      [2,0,2,0,2,0,2,0]];
        
        //savoir si une dame est cliquée
        this.estCliquee = false;
        
        //savoir le joueur qui doit jouer
        this.joueurActuel = "bleu";
        
        //Savoir l'index de la dame qui a été cliqué
        this.indexDameCliquee = 0;
        
        //Les touches fléchées du clavier
        this.lesFleches = null;
        
        //Les tableaux de dames
        this.damesBleus = [];
        this.damesRouges = [];
        
        //calcul des décalages
        this.decalageGauche = 0;
        this.decalageHaut = 0;
        
        //gardé en mémoire la dernière dame sélectionné
        this.derniereDameSelectionee = null;
        
        //L'index des dames à détruire
        this.indexDesDamesADetruire = [[null,null,null,null,null,null,null,null],
                                       [null,null,null,null,null,null,null,null],
                                       [null,null,null,null,null,null,null,null],
                                       [null,null,null,null,null,null,null,null],
                                       [null,null,null,null,null,null,null,null],
                                       [null,null,null,null,null,null,null,null],
                                       [null,null,null,null,null,null,null,null],
                                       [null,null,null,null,null,null,null,null]
                                      ];
        //Le son des dames
        this.sonDeplacement = null;
        
        //le texte pour afficher le nombre de dames restantes a manger pour chaque joueur
        this.texteDamesBleus = null;
        this.texteDamesRouges = null;
        //le texte pour le joueur actuel
        this.texteTourJoueur = null;
        //le texte pour le temps
        this.tempsTexte = null;
        
        //Le nombre de dames restantes à manger
        this.nbDamesBleusRestantes = 10;
        this.nbDamesRougesRestantes = 10;
        
        //Le temps écoulé
        this.tempsEcoule = 0;
        
        //les dames animées
        this.dameAnimeBleu = null;
        this.dameAnimeRouge = null;
    };

    Jeu.prototype = {
		
		init:function(){
            //initialisation des variables au lancement du jeu
            this.damier = [[0,1,0,1,0,1,0,1],
                          [1,0,1,0,1,0,1,0],
                          [0,1,0,1,0,1,0,1],
                          [0,0,0,0,0,0,0,0],
                          [0,0,0,0,0,0,0,0],
                          [2,0,2,0,2,0,2,0],
                          [0,2,0,2,0,2,0,2],
                          [2,0,2,0,2,0,2,0]];
            this.indexDesDamesADetruire = [[0]];
            this.estCliquee = false;
            this.joueurActuel = "bleu";
            this.indexDameCliquee = 0;
            this.lesFleches = leJeu.input.keyboard.createCursorKeys();  
            this.damesBleus = [];
            this.damesRouges = []
            this.derniereDameSelectionee = null;
            this.indexDesDamesADetruire = [[null,null,null,null,null,null,null,null],
                                           [null,null,null,null,null,null,null,null],
                                           [null,null,null,null,null,null,null,null],
                                           [null,null,null,null,null,null,null,null],
                                           [null,null,null,null,null,null,null,null],
                                           [null,null,null,null,null,null,null,null],
                                           [null,null,null,null,null,null,null,null],
                                           [null,null,null,null,null,null,null,null]
                                          ];
            this.nbDamesBleusRestantes = 10;
            this.nbDamesRougesRestantes = 10;
            this.tempsEcoule = 0;
            this.dameAnimeBleu = null;
            this.dameAnimeRouge = null;
            //variables globales
            joueurGagnant = "";
            
        },
		
        create: function(){
            //Créer le damier
            this.creerDamier();
            //style pour le texte en noir
            var styleNoir = {font: "18px monospace", fill: "black", align: "center"};
            //Place le texte a gauche du jeu, pour le joueur bleu
            var styleTexte1 = {font: "32px monospace", fill: "blue", align: "center"};
            var texteBleu = leJeu.add.text(110, leJeu.height/4, "Joueur bleu", styleTexte1);
            texteBleu.anchor.set(0.5, 0);
            this.texteDamesRouges = leJeu.add.text(25, leJeu.height/3, "Dames restantes à \n manger :\n"+this.nbDamesRougesRestantes, styleNoir);
            
            //Place le texte a droite du jeu, pour le joueur rouge
            var styleTexte2 = {font: "32px monospace", fill: "red", align: "center"};
            var texteRouge = leJeu.add.text(leJeu.width-115, leJeu.height/4, "Joueur rouge", styleTexte2);
            texteRouge.anchor.set(0.5, 0);
            this.texteDamesBleus = leJeu.add.text(leJeu.width-195, leJeu.height/3, "Dames restantes à \n manger :\n"+this.nbDamesBleusRestantes, styleNoir);
            
            //Place le texte qui indique le tour du joueur
            var styleJoueur = {font: "30px monospace", fill: "black", align: "center"};
            this.texteTourJoueur = leJeu.add.text(leJeu.width/2, leJeu.height-50, "Tour joueur "+this.joueurActuel, styleJoueur);
            this.texteTourJoueur.anchor.set(0.5, 0);
            
            //Place le texte qui indique le temps écoulé depuis le début de la partie
            this.tempsTexte = leJeu.add.text(leJeu.width/2, 20, this.tempsEcoule, styleJoueur);
            this.tempsTexte.anchor.set(0.5,0);
                
            //Ajouter le son pour le déplacement des dames
            this.sonDeplacement = leJeu.add.audio("sonDames", 0.7);
            
            //Changer la couleur de fond du jeu
            leJeu.stage.backgroundColor = "#d3d3d3";
            
            //Dames animées
            var animeBleu = leJeu.add.sprite(80,leJeu.height*0.5, "dames", 0);
            var animeRouge = leJeu.add.sprite(leJeu.width-135,leJeu.height*0.5, "dames", 2);
            
            //Les animations
            this.dameAnimeBleu = leJeu.add.tween(animeBleu).to({y:animeBleu.y+50}, 800, Phaser.Easing.Linear.InOut ,true,0,-1,true);
            this.dameAnimeRouge = leJeu.add.tween(animeRouge).to({y:animeBleu.y+50}, 800, Phaser.Easing.Linear.InOut ,false,0,-1,true);
            
            //Partir la minuterie pour le temps du jeu
            leJeu.time.events.loop(Phaser.Timer.SECOND, this.augmenterTemps, this);
        },
        //Crée le damier et place les dames
        creerDamier : function(){
            //Calculer le décalage
           this.decalageGauche = (leJeu.width - (NB_COLONNES * TAILLE_TUILES) - (NB_COLONNES - 1))/2;
           this.decalageHaut = (leJeu.height - (NB_LIGNES * TAILLE_TUILES) - (NB_LIGNES - 1))/2;
            
            //initialisation des variables pour la création de l'échiquier
            var caseEchec, posX, posY, laDameBleu, laDameRouge;
            var couleurEchec = 1;
            var changementDeLignes = 0;
            var iCompteurBleu = 0;
            var iCompteurRouge = 0;
            
          //Création du damier
            for(var i = 0; i<NB_TUILES; i++){
                //position des cases
                posX = this.decalageGauche + ((i%NB_COLONNES) * TAILLE_TUILES);
                posY = this.decalageHaut + (Math.floor(i/NB_COLONNES)* TAILLE_TUILES);
                
                //Permet de faire commencer chaque ligne avec une couleur différente de la précédente
                if(i%8 == 0)couleurEchec = couleurEchec*-1;
                
                //choisi la couleur de la case et l'instancie
                if(couleurEchec == 1){
                    caseEchec= leJeu.add.sprite(posX, posY, "casesEchec", 1);
                } else {
                    caseEchec= leJeu.add.sprite(posX, posY, "casesEchec", 0);
                }
                
                //Alterne la couleur
                couleurEchec = couleurEchec*-1;
            }
           
            //place les dames dans le damier
            for(var iLi = 0; iLi<NB_LIGNES; iLi++){
                for(var iCol = 0; iCol<NB_COLONNES; iCol++){
                    //Calcule de la position en x et en y
                    posX= this.decalageGauche + (iCol * TAILLE_TUILES);
                    posY= this.decalageHaut + (iLi* TAILLE_TUILES);
                    
                    switch(this.damier[iLi][iCol]){
                        case 1 : //si c'est une dame bleu
                            //On instancie la dame en bouton
                            laDameBleu = leJeu.add.button(posX, posY, "dames" ,this.jouerDame ,this);
                            laDameBleu.frame = 0;
                           
                            //reconnaitre l'appartenance de la dame
                            laDameBleu.couleurJoueur = "bleu";
                            
                            //Savoir la position de la dame
                            laDameBleu.colonne=iCol;
                            laDameBleu.ligne=iLi;
                            
                            //rajouter l'index de la dame
                            laDameBleu.indexDame = iCompteurBleu;
                            
                            //rajoute l'index de la dame dans son tableau au tableau des dames à détruire
                            this.indexDesDamesADetruire[iLi][iCol] = iCompteurBleu;
                            
                            //On incrémente le compteur
                            iCompteurBleu++;
                            
                            //rajouter la dame dans le tableau
                            this.damesBleus.push(laDameBleu);
                            
                            break;
                        case 2 : //Si c'est une dame rouge
                            //On instancie la dame en bouton
                            laDameRouge = leJeu.add.button(posX, posY, "dames" ,this.jouerDame ,this);
                            laDameRouge.frame = 2;
                           
                            //reconnaitre l'appartenance de la dame
                            laDameRouge.couleurJoueur = "rouge";
                            
                             //Savoir la position de la dame
                            laDameRouge.colonne=iCol;
                            laDameRouge.ligne=iLi;
                            
                            //rajouter l'index de la dame
                            laDameRouge.indexDame = iCompteurRouge;
                            
                            //rajoute l'index de la dame dans son tableau au tableau des dames à détruire
                            this.indexDesDamesADetruire[iLi][iCol] = iCompteurRouge;
                            
                            //On incrémente le compteur
                            iCompteurRouge++;

                            //rajouter la dame dans le tableau
                            this.damesRouges.push(laDameRouge);

                            break;
                    }
                }
            }
        },
        //Lorsqu'on clique sur une dame, elle s'active et on peut la jouer
        jouerDame : function(cible){
            //Savoir si la dame cliquée est de la bonne couleur (Celle du joueur en cours)
            if(cible.couleurJoueur == this.joueurActuel){
                //Si le joueur choisi une autre dame, l'autre se remet à son état de base
                if(this.estCliquee == true){
                    this.derniereDameSelectionee.frame--;
                }
                
                //Enregistre la derniere dame activé
                this.derniereDameSelectionee = cible;
                
                //Active le controle des dames avec les fleches
                this.estCliquee = true;
                
                //enregistre l'index de la dame cliqué
                this.indexDameCliquee = cible.indexDame;
                
                //Change le frame de la dame lorsqu'on clique dessus (bleu)
                if(cible.couleurJoueur == "bleu"){
                    if(cible.frame == 0){
                        cible.frame++;
                    }
                }
                //Change le frame de la dame lorsqu'on clique dessus (rouge)
                if(cible.couleurJoueur == "rouge"){
                    if(cible.frame == 2){
                        cible.frame++;
                    }
                }
            }
        },
        //augmente le temps qui est affiché en haut du jeu
        augmenterTemps: function(){
            this.tempsEcoule++;
            this.tempsTexte.text = this.tempsEcoule;
        },

        update: function(){
            //Détecte si une dame à été cliqué
            if(this.estCliquee == true){
                //Regarde le joueur qui est en cours de jeu
                switch(this.joueurActuel){
                    case "bleu" :  
                            //Pousser la dame vers la gauche
                            if (this.lesFleches.left.isDown) {
                                //identifier la dame dans une variable
                                var uneDame = this.damesBleus[this.indexDameCliquee];
                                //si la dame se trouve sur la dernière ligne, elle ne peut pas bouger
                                if(uneDame.ligne == 7){
                                    //désactive le clique
                                    this.estCliquee = false;
                                    //remet le frame de la dame a la postition de base
                                    uneDame.frame--;
                                }
                                //si la case suivante est vide, on la bouge
                                else if(this.damier[uneDame.ligne+1][uneDame.colonne-1] == 0){
                                    //bouge l'index de la dame dans le tableau des dames à détruires
                                    this.indexDesDamesADetruire[uneDame.ligne+1][uneDame.colonne-1] = this.indexDesDamesADetruire[uneDame.ligne][uneDame.colonne];
                                    this.indexDesDamesADetruire[uneDame.ligne][uneDame.colonne] = null;
                                    //On vide l'ancienne position de la dame
                                    this.damier[uneDame.ligne][uneDame.colonne] = 0;
                                    //On change les attributs ligne et colonne de la dame pour mémorisé sa position
                                    uneDame.colonne-=1;
                                    uneDame.ligne+=1;
                                    //On change le type de la dame à la nouvelle position
                                    this.damier[uneDame.ligne][uneDame.colonne] = 1;
                                    //On bouge la dame
                                    uneDame.x = this.decalageGauche + (uneDame.colonne* TAILLE_TUILES);
                                    uneDame.y = this.decalageHaut + (uneDame.ligne* TAILLE_TUILES);
                                    //désactive le clique
                                    this.estCliquee = false;
                                    //On change le tour du joueur
                                    this.joueurActuel = "rouge";
                                    //On change le texte du joueur actuel
                                    this.texteTourJoueur.text = "Tour joueur "+this.joueurActuel;
                                    //remet le frame de la dame a la postition de base
                                    uneDame.frame--;
                                    //On fait jouer le son de déplacement
                                    this.sonDeplacement.play();

                                } 
                                //si la case suivante est occupée par un ennemi mais que la case d'après n'est pas une case de jeu
                                else if(this.damier[uneDame.ligne+1][uneDame.colonne-1] == 2 && uneDame.ligne+1 == 7){
                                    //désactive le clique
                                    this.estCliquee = false;
                                    //remet le frame de la dame a la postition de base
                                    uneDame.frame--;
                                }
                                //si la case suivante est occupée par un ennemi et que celle d'après est vide 
                                else if(this.damier[uneDame.ligne+1][uneDame.colonne-1] == 2 && this.damier[uneDame.ligne+2][uneDame.colonne-2] == 0){
                                    //bouge l'index de la dame dans le tableau des dames à détruires
                                    this.indexDesDamesADetruire[uneDame.ligne+2][uneDame.colonne-2] = this.indexDesDamesADetruire[uneDame.ligne][uneDame.colonne];
                                    this.indexDesDamesADetruire[uneDame.ligne][uneDame.colonne] = null;
                                    //On vide l'ancienne position de la dame
                                    this.damier[uneDame.ligne][uneDame.colonne] = 0;
                                    //Manger la dame ennemi
                                    //On la détruit
                                    this.damesRouges[this.indexDesDamesADetruire[uneDame.ligne+1][uneDame.colonne-1]].destroy();
                                    //on change son type pour une case vide
                                    this.damier[uneDame.ligne+1][uneDame.colonne-1] = 0;
                                    //on baisse le nombre de dames rouges à manger
                                    this.nbDamesRougesRestantes--;
                                    //On change les attributs ligne et colonne de la dame pour mémorisé sa position
                                    uneDame.colonne-=2;
                                    uneDame.ligne+=2;
                                    //On change le type de la dame à la nouvelle position
                                    this.damier[uneDame.ligne][uneDame.colonne] = 1;
                                    //On bouge la dame
                                    uneDame.x = this.decalageGauche + (uneDame.colonne* TAILLE_TUILES);
                                    uneDame.y = this.decalageHaut + (uneDame.ligne* TAILLE_TUILES);
                                    //désactive le clique
                                    this.estCliquee = false;
                                    //remet le frame de la dame a la postition de base
                                    uneDame.frame--;
                                    //On fait jouer le son de déplacement
                                    this.sonDeplacement.play();
                                }
                                //si la case suivante est occupée par un ennemi mais que celle d'après est occupée par une autre dame 
                                else if(this.damier[uneDame.ligne+1][uneDame.colonne-1] == 2 && this.damier[uneDame.ligne+2][uneDame.colonne-2] != 0){
                                    //On désactive le clique
                                    this.estCliquee = false;
                                    //remet le frame de la dame a la postition de base
                                    uneDame.frame--;
                                }
                            }
                            //Pousser la dame vers la droite
                            ///////// Je n'ai pas commenté le reste des déplacements des dames puisque ça fonctionne de la même fâçon que la première partie
                            ///////// mais avec des valeurs différentes
                            if (this.lesFleches.right.isDown){
                                 
                                var uneDame = this.damesBleus[this.indexDameCliquee];
                                
                                if(uneDame.ligne == 7){
                                    this.estCliquee = false;
                                    uneDame.frame--;
                                }
                                else if(this.damier[uneDame.ligne+1][uneDame.colonne+1] == 0){
                                    
                                    this.indexDesDamesADetruire[uneDame.ligne+1][uneDame.colonne+1] = this.indexDesDamesADetruire[uneDame.ligne][uneDame.colonne];
                                    this.indexDesDamesADetruire[uneDame.ligne][uneDame.colonne] = null;
                                    
                                    this.damier[uneDame.ligne][uneDame.colonne] = 0;
                                    
                                    uneDame.colonne+=1;
                                    uneDame.ligne+=1;
                                    
                                    this.damier[uneDame.ligne][uneDame.colonne] = 1;

                                    uneDame.x = this.decalageGauche + (uneDame.colonne* TAILLE_TUILES);
                                    uneDame.y = this.decalageHaut + (uneDame.ligne* TAILLE_TUILES);

                                    this.estCliquee = false;
                                    this.joueurActuel = "rouge";
                                    this.texteTourJoueur.text = "Tour joueur "+this.joueurActuel;
                                    uneDame.frame--;
                                    this.sonDeplacement.play();
                                } 
                                else if(this.damier[uneDame.ligne+1][uneDame.colonne+1] == 2 && uneDame.ligne+1 == 7){
                                    this.estCliquee = false;
                                    uneDame.frame--;
                                }
                                else if(this.damier[uneDame.ligne+1][uneDame.colonne+1] == 2 && this.damier[uneDame.ligne+2][uneDame.colonne+2] == 0){

                                    this.indexDesDamesADetruire[uneDame.ligne+2][uneDame.colonne+2] = this.indexDesDamesADetruire[uneDame.ligne][uneDame.colonne];
                                    this.indexDesDamesADetruire[uneDame.ligne][uneDame.colonne] = null;
                                    
                                    this.damier[uneDame.ligne][uneDame.colonne] = 0;
                                    
                                    //Manger la dame ennemi
                                    this.damesRouges[this.indexDesDamesADetruire[uneDame.ligne+1][uneDame.colonne+1]].destroy();
                                    this.damier[uneDame.ligne+1][uneDame.colonne+1] = 0;
                                    this.nbDamesRougesRestantes--;
                                    
                                    //bouger la dame
                                    uneDame.colonne+=2;
                                    uneDame.ligne+=2;
                                    
                                    this.damier[uneDame.ligne][uneDame.colonne] = 1;

                                    uneDame.x = this.decalageGauche + (uneDame.colonne* TAILLE_TUILES);
                                    uneDame.y = this.decalageHaut + (uneDame.ligne* TAILLE_TUILES);

                                    this.estCliquee = false;
                                    
                                    uneDame.frame--;
                                    this.sonDeplacement.play();
                                }
                                else if(this.damier[uneDame.ligne+1][uneDame.colonne+1] == 2 && this.damier[uneDame.ligne+2][uneDame.colonne+2] != 0){
                                    this.estCliquee = false;
                                    uneDame.frame--;
                                }
                            }
                        break;
                    
                    case "rouge" :  
                            //Pousser la dame vers la gauche
                            if (this.lesFleches.left.isDown) {
                                
                                var uneDame = this.damesRouges[this.indexDameCliquee];
                                
                                if(uneDame.ligne == 0){
                                    this.estCliquee = false;
                                    uneDame.frame--;
                                }
                                else if(this.damier[uneDame.ligne-1][uneDame.colonne-1] == 0){
                                     
                                    this.indexDesDamesADetruire[uneDame.ligne-1][uneDame.colonne-1] = this.indexDesDamesADetruire[uneDame.ligne][uneDame.colonne];
                                    this.indexDesDamesADetruire[uneDame.ligne][uneDame.colonne] = null;
                                    
                                    this.damier[uneDame.ligne][uneDame.colonne] = 0;
                                    
                                    uneDame.colonne-=1;
                                    uneDame.ligne-=1;
                                    
                                    this.damier[uneDame.ligne][uneDame.colonne] = 2;

                                    uneDame.x = this.decalageGauche + (uneDame.colonne* TAILLE_TUILES);
                                    uneDame.y = this.decalageHaut + (uneDame.ligne* TAILLE_TUILES);

                                    this.estCliquee = false;
                                    this.joueurActuel = "bleu";
                                    this.texteTourJoueur.text = "Tour joueur "+this.joueurActuel;
                                    uneDame.frame--;
                                    this.sonDeplacement.play();
                                } 
                                else if(this.damier[uneDame.ligne-1][uneDame.colonne-1] == 1 && uneDame.ligne-1 == 0){
                                    this.estCliquee = false;
                                    uneDame.frame--;
                                }
                                else if(this.damier[uneDame.ligne-1][uneDame.colonne-1] == 1 && this.damier[uneDame.ligne-2][uneDame.colonne-2] == 0){
                                    
                                    this.indexDesDamesADetruire[uneDame.ligne-2][uneDame.colonne-2] = this.indexDesDamesADetruire[uneDame.ligne][uneDame.colonne];
                                    this.indexDesDamesADetruire[uneDame.ligne][uneDame.colonne] = null;
                                    
                                    this.damier[uneDame.ligne][uneDame.colonne] = 0;
                                    
                                    //Manger la dame ennemi
                                    this.damesBleus[this.indexDesDamesADetruire[uneDame.ligne-1][uneDame.colonne-1]].destroy();
                                    this.damier[uneDame.ligne-1][uneDame.colonne-1] = 0;
                                    this.nbDamesBleusRestantes--;
                                    
                                    //bouger la dame
                                    uneDame.colonne-=2;
                                    uneDame.ligne-=2;
                                    
                                    this.damier[uneDame.ligne][uneDame.colonne] = 2;

                                    uneDame.x = this.decalageGauche + (uneDame.colonne* TAILLE_TUILES);
                                    uneDame.y = this.decalageHaut + (uneDame.ligne* TAILLE_TUILES);

                                    this.estCliquee = false;
                                    
                                    uneDame.frame--;
                                    this.sonDeplacement.play();
                                }
                                else if(this.damier[uneDame.ligne-1][uneDame.colonne-1] == 2 && this.damier[uneDame.ligne-2][uneDame.colonne-2] != 0){
                                    this.estCliquee = false;
                                    uneDame.frame--;
                                }
                            }
                            //Pousser la dame vers la droite
                            if (this.lesFleches.right.isDown) {
                                
                                var uneDame = this.damesRouges[this.indexDameCliquee];
                                
                                if(uneDame.ligne == 0){
                                    this.estCliquee = false;
                                    uneDame.frame--;
                                }
                                else if(this.damier[uneDame.ligne-1][uneDame.colonne+1] == 0){
                                    
                                    this.indexDesDamesADetruire[uneDame.ligne-1][uneDame.colonne+1] = this.indexDesDamesADetruire[uneDame.ligne][uneDame.colonne];
                                    this.indexDesDamesADetruire[uneDame.ligne][uneDame.colonne] = null;
                                    
                                    this.damier[uneDame.ligne][uneDame.colonne] = 0;
                                    
                                    uneDame.colonne+=1;
                                    uneDame.ligne-=1;
                                    
                                    this.damier[uneDame.ligne][uneDame.colonne] = 2;

                                    uneDame.x = this.decalageGauche + (uneDame.colonne* TAILLE_TUILES);
                                    uneDame.y = this.decalageHaut + (uneDame.ligne* TAILLE_TUILES);

                                    this.estCliquee = false;
                                    this.joueurActuel = "bleu";
                                    this.texteTourJoueur.text = "Tour joueur "+this.joueurActuel;
                                    uneDame.frame--;
                                    this.sonDeplacement.play();
                                } 
                                else if(this.damier[uneDame.ligne-1][uneDame.colonne-1] == 1 && uneDame.ligne-1 == 0){
                                    this.estCliquee = false;
                                    uneDame.frame--;
                                }
                                else if(this.damier[uneDame.ligne-1][uneDame.colonne+1] == 1 && this.damier[uneDame.ligne-2][uneDame.colonne+2] == 0){
                                      
                                    this.indexDesDamesADetruire[uneDame.ligne-2][uneDame.colonne+2] = this.indexDesDamesADetruire[uneDame.ligne][uneDame.colonne];
                                    this.indexDesDamesADetruire[uneDame.ligne][uneDame.colonne] = null;
                                    
                                    this.damier[uneDame.ligne][uneDame.colonne] = 0;
                                    
                                    //Manger la dame ennemi
                                    this.damesBleus[this.indexDesDamesADetruire[uneDame.ligne-1][uneDame.colonne+1]].destroy();
                                    this.damier[uneDame.ligne-1][uneDame.colonne+1] = 0;
                                    this.nbDamesBleusRestantes--;
                                    
                                    //bouger la dame
                                    uneDame.colonne+=2;
                                    uneDame.ligne-=2;
                                    
                                    this.damier[uneDame.ligne][uneDame.colonne] = 2;

                                    uneDame.x = this.decalageGauche + (uneDame.colonne* TAILLE_TUILES);
                                    uneDame.y = this.decalageHaut + (uneDame.ligne* TAILLE_TUILES);  

                                    this.estCliquee = false;
                                    
                                    uneDame.frame--;
                                    this.sonDeplacement.play();
                                }
                                else if(this.damier[uneDame.ligne-1][uneDame.colonne+1] == 2 && this.damier[uneDame.ligne-2][uneDame.colonne+2] != 0){
                                    this.estCliquee = false;
                                    uneDame.frame--;
                                }
                            }
                        break;
                }
            }
            //Changer le texte pour que le nombre de dames restante à manger soit afficher de chaque côté
            this.texteDamesBleus.text = "Dames restantes à \n manger :\n"+this.nbDamesBleusRestantes;
            this.texteDamesRouges.text ="Dames restantes à \n manger :\n"+this.nbDamesRougesRestantes;
            
            //Gérer les animations
            //Petit bug ici que je n'ai pas eu le temps de régler. Je voulais que l'animation fonctionne lorsque c'était le tour du bon joueur
            //mais après avoir fontionnée une fois, les animations ne repartent plus jamais.
            switch(this.joueurActuel){
                case "bleu": 
                    this.dameAnimeRouge.stop();
                    this.dameAnimeBleu.start();
                    break;
                case "rouge":
                    this.dameAnimeBleu.stop();
                    this.dameAnimeRouge.start();
                    break;
            }
            
            //Si le nombre de dames bleus restantes à manger est a 0
            if(this.nbDamesBleusRestantes == 0){
                //On met le joueur gagnant à rouge
                joueurGagnant = "rouge";
                //On appelle l'écran de fin de jeu
                leJeu.state.start("FinJeu");
            }
            //Si le nombre de dames rouges restantes à manger est a 0
            if(this.nbDamesRougesRestantes == 0){
                //On met le joueur gagnant à bleu
                joueurGagnant = "bleu";
                //On appelle l'écran de fin de jeu
                leJeu.state.start("FinJeu");
            }
        }
    };


    ////////////////////////////////
    //          EcranFinJeu       //
    ////////////////////////////////


    /**
    * Classe permettant de définir l'écran (state)
    * pour la scène de la fin du jeu
    */

    var FinJeu = function FinJeu(){ };

    FinJeu.prototype = {

        create: function(){ 
            //Regarde qui est le joueur gagnant
           switch(joueurGagnant){
                   //affiche l'image de la fin pour le joueur bleu
               case "bleu" : leJeu.add.image(0,0, "finBleu");
                   break;
                   //affiche l'image de la fin pour le joueur rouge
               case "rouge" : leJeu.add.image(0,0, "finRouge");
                   break;
            }
            //Instancie le bouton qui permet de rejouer au jeu
            var boutonRejouer = leJeu.add.button(leJeu.width/2, leJeu.height/2+125, "boutonRejouer", this.rejouer, this,1,0,2,0);
            boutonRejouer.anchor.set(0.5);
        },
        //Permet de recommencer une partie
        rejouer: function(){
            //Aller à l'écran de jeu
            leJeu.state.start("Jeu");      
        }
    };    

})();//Fin IIFE