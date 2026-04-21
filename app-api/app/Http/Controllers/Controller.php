<?php

namespace App\Http\Controllers;

abstract class Controller
{
    protected function badRequest($validator)
    {
        return response()->json([
            'ok' => false,
            'errors' => $validator->errors()
        ], 400);
    }

    protected function error($message = "Something went wrong.", $data = null)
    {
        return response()->json([
            'ok' => false, 
            'message' => $message,
            'data' => $data
        ], 400);
    }

    protected function ok($data = null, $message = "OK", $others = null)
    {
        return response()->json([
            'ok' => true, 
            'message' => $message,
            'data' => $data, 
            'others' => $others
        ], 200);
    }

    protected function noDataFound()
    {
        return response()->json([
            'ok' => false, 
            'message' => 'No Data Found.'
        ], 404);
    }

    protected function unauthorized($message = "Unauthorized!")
    {
        return response()->json([
            'ok' => false, 
            'message' => $message
        ], 401);
    }
}
