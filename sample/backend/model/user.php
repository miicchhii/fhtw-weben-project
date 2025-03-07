<?php

/** User Model 
 */
class User {

    public $id;
    public $email;
    public $first_name;
    public $last_name;
    public $avatar;    


    public function __construct(int $id, string $email, string $first_name, 
                                string $last_name, string $avatar) {
        $this->id         = $id;
        $this->email      = $email;
        $this->first_name = $first_name;
        $this->last_name  = $last_name;
        $this->avatar     = $avatar;
    }

}

