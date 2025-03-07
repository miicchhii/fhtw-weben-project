<?php

include_once "model/user.php";

/** User Service Class
 *  - implements CRUD operations
 *  - no database required users are read from 'users.json'
 *  - database could easily be added - just replace file access with SQL statements
 * 
 * IMPORTANT: users.json must be writable!
 */
class UserService {

    private static $filename = "users.json";


    /** find all users
     */
    public function findAll() {        
        // use "@" to surpress warnings
        if (($content = @file_get_contents(UserService::$filename)) === false) {
            return [];
        }

        if (($json = @json_decode($content)) === null) {
            return [];
        }

        $users = [];
        foreach ($json as $v) {
            $users[] = new User($v->id, $v->email, $v->first_name, $v->last_name, $v->avatar);            
        }
        return $users;
    }


    /** find by id     
     * @param int id the user ID
     * @return User the user or null
     */
    public function findByID(int $id) {
        $users = $this->findAll();
        foreach ($users as $u) {
            if ($u->id == $id) {
                return $u;
            }
        }

        return null;
    }


    /** save this user
     * @param User $user 
     * @return User the saved user
     */
    public function save(User $user) {
        $users = $this->findAll();
        $maxid = 0;

        // update
        if ($user->id > 0) {
            foreach ($users as $k => $v) {
                if ($v->id == $user->id) {
                    $users[$k] = $user;
                    if ($this->persist($users) == false) {
                        return false;
                    }
                    return $user;
                }
            }

            // update failed!
            return false;
        }

        // new entry!
        $maxid = 0;
        foreach ($users as $k => $v) {
            $maxid = max($maxid, $v->id);
        }

        $user->id = $maxid + 1;
        $users[] = $user;
        if ($this->persist($users) == false) {
            return false;
        }
        return $user;
    }


    /** delete this user
     * @param User $user
     * @return bool true on success, else false
     */    
    public function delete(User $user) {
        $users = $this->findAll();
        for ($i = 0; $i < count($users); $i++) {
            $v = $users[$i];
            if ($v->id == $user->id) {
                array_splice($users, $i, 1);
                return $this->persist($users);
            }
        }

        return false;
    }


    /** write users to "database" 
     * @param array $users
     */
    private function persist(array $users) {
        return @file_put_contents(UserService::$filename, json_encode($users));            
    }
}

