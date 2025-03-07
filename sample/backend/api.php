<?php

include_once "model/user.php";
include_once "service/userservice.php";

/** quite helpful for debugging */
// echo "<pre>\$_SERVER=" . print_r($_SERVER, true) . "</pre>";
// echo "<pre>\$_GET=" . print_r($_GET, true) . "</pre>";
// echo "<pre>\$_POST=" . print_r($_POST, true) . "</pre>";

$api = new Api();
$api->processRequest();



/** API Class 
 * handles requests
 *  - GET users .... find all users
 *  - GET user ..... find user by ID
 *  - POST user .... save user (= create new one)
 *  - DELETE user .. delete existing user
 */
class Api {

    private $userService;

    public function __construct() {
        $this->userService = new UserService();
    }


    /** switch request method 
     */
    public function processRequest() {        
        $method = $_SERVER['REQUEST_METHOD'];   // GET, POST, DELETE ?!
        switch ($method) {

            case "GET":
                $this->processGet();
                break;

            case "POST":
                $this->processPost();
                break;
            
            case "DELETE":
                $this->processDelete();
                break;

            default:
                // finally 
                $this->error(405, ["Allow: GET, POST, DELETE"], "Method not allowed");                
        }
    }


    /** process GET request 
     */
    private function processGet() {        
        // empty parameters ... print Hello World
        if (empty($_GET)) {
            $this->success(200, "Hello World!");
        
        // ?users ... load all users
        } else if (isset($_GET["users"])) {
            $users = $this->userService->findAll();
            $this->success(200, $users);

        // ?user=X ... load user by ID 
        } else if (isset($_GET["user"])) {
            $id = $_GET["user"];        
            $user = $this->userService->findByID(intval($id));
            if ($user === null) {
                $this->error(404, [], "No such user " . $id);
            }

            $this->success(200, $user);

        // unknown request?!
        } else {
            $this->error(400, [], "Bad Request - invalid parameters " . http_build_query($_GET));
        }
    }


    /** process POST request 
     */
    function processPost() {
        // create new
        if (!isset($_GET["user"])) {
            $this->error(400, [], "Bad Request - invalid path " . http_build_query($_GET));
        }

        // fetch data from posted body
        $data = json_decode(file_get_contents('php://input'));

        // check json data
        if (!isset($data->email) || !isset($data->first_name) || !isset($data->last_name)
                || empty($data->email) || empty($data->first_name) || empty($data->last_name)) {
            $this->error(400, [], "Bad Request - email, first_name, last_name are required!");
        }
        
        // create user object
        $id     = isset($data->id) ? intval($data->id) : 0;
        $avatar = isset($data->avatar) ? $data->avatar : "";
        $user = new User($id, $data->email, $data->first_name, $data->last_name, $avatar);        
        
        if (($result = $this->userService->save($user)) === false) {
            $this->error(400, [], "Bad Request - error saving user");
        }

        // status code 201 = "created"
        $this->success($id == 0 ? 201 : 200, $result);
    }


    /** process DELETE request 
     */
    function processDelete() {
        // delete user    
        if (!isset($_GET["user"])) {
            $this->error(400, [], "Bad Request - invalid parameters " . http_build_query($_GET));
        }


        $id = intval($_GET["user"]);
        if (($user = $this->userService->findByID($id)) === null) {
            $this->error(404, [], "No such user " . $id);
        }

        if ($this->userService->delete($user) === false) {
            $this->error(400, [], "Bad Request - error deleting user");            
        }

        $this->success(200, $user);
    }


    /** format success response and exit
     * @param int $code HTTP code (2xx)
     * @param $obj result object
    */
    private function success(int $code, $obj) {
        http_response_code($code);
        header('Content-Type: application/json');
        echo(json_encode($obj));
        exit;
    }

    /** format error (with headers) and exit
     * @param int $code HTTP response code (4xx or 5xx)
     * @param array $headers
     * @param string $msg 
     */
    private function error(int $code, array $headers, $msg) {
        http_response_code($code);
        foreach ($headers as $hdr) {
            header($hdr);
        }    
        echo ($msg);
        exit;
    }    

}


